/**
 * Quant Review Tool — delegates quantitative review to a configured model
 * (default cmd-deepseek-v4-pro) via LiteLLM.
 *
 * The primary executor (DeepSeek V4 Flash) calls this tool whenever a
 * scope-aware quant review is needed. The tool:
 *   1. reads the experiment scope (EXPERIMENT_SCOPE.md) if provided,
 *   2. reads the analysis packet (JSON/markdown),
 *   3. sends BOTH to the configured quant model via the
 *      LiteLLM proxy with the scope-aware reviewer system prompt,
 *   4. returns the full structured verdict to the calling model as tool result.
 *
 * This is a REAL model delegation — unlike role-play, the verdict is produced
 * by the configured model itself, not by the executor pretending to be it.
 *
 * ## Configuration
 *
 * Settings are stored in `~/.pi/agent/quant-tool.json`:
 *   {
 *     "provider": "litellm",
 *     "model": "cmd-deepseek-v4-pro",
 *     "maxTokens": 32000,
 *     "temperature": 0,
 *     "enabled": true
 *   }
 *
 * The provider/model must be defined in ~/.pi/agent/models.json.
 * Override via env vars (fallback): PI_QUANT_PROVIDER, PI_QUANT_MODEL,
 * PI_QUANT_MAX_TOKENS.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type { Model } from "@earendil-works/pi-ai";
import type { Api } from "@earendil-works/pi-ai";
import { Text } from "@earendil-works/pi-tui";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface QuantConfig {
  provider?: string;
  model?: string;
  fallbacks?: string[];
  maxTokens: number;
  temperature: number;
  retries: number;
  enabled: boolean;
}

const DEFAULT_CONFIG: QuantConfig = {
  provider: "litellm",
  model: "cmd-deepseek-v4-pro",
  fallbacks: ["cmd-deepseek-v4-flash"],
  maxTokens: 32000,
  temperature: 0,
  retries: 2,
  enabled: true,
};

let config: QuantConfig = { ...DEFAULT_CONFIG };

function configFilePath(): string {
  return resolve(getAgentDir(), "quant-tool.json");
}

function resolveConfig(): QuantConfig {
  const cfg: QuantConfig = { ...DEFAULT_CONFIG };
  try {
    if (existsSync(configFilePath())) {
      const raw = readFileSync(configFilePath(), "utf8");
      const parsed = JSON.parse(raw) as Partial<QuantConfig>;
      if (parsed.provider) cfg.provider = parsed.provider;
      if (parsed.model) cfg.model = parsed.model;
      if (Array.isArray(parsed.fallbacks)) cfg.fallbacks = parsed.fallbacks;
      if (typeof parsed.maxTokens === "number") cfg.maxTokens = parsed.maxTokens;
      if (typeof parsed.temperature === "number") cfg.temperature = parsed.temperature;
      if (typeof parsed.retries === "number") cfg.retries = parsed.retries;
      if (typeof parsed.enabled === "boolean") cfg.enabled = parsed.enabled;
    }
  } catch {
    // fall back to defaults
  }
  // env overrides (legacy fallback)
  if (process.env.PI_QUANT_PROVIDER) cfg.provider = process.env.PI_QUANT_PROVIDER;
  if (process.env.PI_QUANT_MODEL) cfg.model = process.env.PI_QUANT_MODEL;
  if (process.env.PI_QUANT_MAX_TOKENS) {
    const n = parseInt(process.env.PI_QUANT_MAX_TOKENS, 10);
    if (!Number.isNaN(n)) cfg.maxTokens = n;
  }
  return cfg;
}

// ---------------------------------------------------------------------------
// Reviewer system prompt (scope-aware)
// ---------------------------------------------------------------------------

const QUANT_SYSTEM_PROMPT = `You are the independent quantitative reviewer for an AI/ML crypto trading research workflow.

You are scope-aware. Before making recommendations, read and obey the current experiment scope.

You must separate:
1. IN_SCOPE_TUNING
2. OUT_OF_SCOPE_OBSERVATIONS
3. FUTURE_IMPROVEMENTS

Only IN_SCOPE_TUNING may become immediate NEXT_EXPERIMENTS.

Do not introduce new: feature families, model architectures, labels, datasets, tuning dimensions, or fixed-parameter changes unless explicitly allowed by the current scope.

If you identify a useful idea outside scope: record it, explain why it may matter, mark REQUIRES_SCOPE_CHANGE: YES, and do NOT recommend immediate execution.

Prioritize robust, simple, evidence-driven improvements.

Compare current candidates within the active feature space only. Rank current parameter choices. Identify overfitting, regime instability, parameter instability. Recommend changing only currently tunable parameters. Recommend stopping a parameter search when evidence supports it. Recommend collecting missing evidence when needed. Never widen the tuning space silently. Never touch fixed parameters unless the scope explicitly allows it.

Compute nothing you cannot derive from the provided metrics; if measurements are missing, list them under MISSING_EVIDENCE instead of inventing values.

Return exactly this structure:

VERDICT:
PROMOTE | RETUNE | REJECT | NEED_MORE_EVIDENCE

CONFIDENCE:
HIGH | MEDIUM | LOW

SCOPE_STATUS:
VALID | CONFLICT_FOUND

CURRENT_SCOPE_SUMMARY:
...

KEY_FINDINGS:
1. ...
2. ...
3. ...

OVERFITTING_RISK:
LOW | MEDIUM | HIGH

OOS_ROBUSTNESS:
PASS | WEAK | FAIL

REGIME_STABILITY:
PASS | WEAK | FAIL

PARAMETER_STABILITY:
PASS | WEAK | FAIL

CALIBRATION:
PASS | WEAK | NOT_AVAILABLE

COST_ROBUSTNESS:
PASS | WEAK | FAIL | NOT_AVAILABLE

MAIN_FAILURE_MODE:
...

MISSING_EVIDENCE:
- ...

IN_SCOPE_TUNING_RECOMMENDATIONS:
1.
   Parameter:
   Current:
   Proposed:
   Hypothesis:
   Keep Fixed:
   Expected Evidence:
   Success Criterion:
   Failure Criterion:

EXECUTABLE_NEXT_ACTIONS:
1.
   experiment_id:
   config_overrides:
     - key: value
   purpose:
   success_criterion:
   failure_criterion:

OUT_OF_SCOPE_OBSERVATIONS:
- ...

FUTURE_IMPROVEMENTS:
1.
   Idea:
   Why It May Help:
   Evidence Needed:
   REQUIRES_SCOPE_CHANGE: YES

DO_NOT_TUNE:
- ...

STOP_CONDITIONS:
- ...

FINAL_RECOMMENDATION:
...

Output rules:
- MAX_NEXT_EXPERIMENTS = 3, only from currently tunable features/parameters.
- Prefer one hypothesis, one controlled change, one measurable result.
- Out-of-scope ideas go under FUTURE_IMPROVEMENTS with REQUIRES_SCOPE_CHANGE: YES.
- If a recommendation conflicts with scope, mark SCOPE_STATUS: CONFLICT_FOUND and do not present it as an immediate action.
- If the scope file is missing from the packet, state QUANT_REVIEW_BLOCKED: EXPERIMENT_SCOPE_MISSING and do not give tuning recommendations.`;

// ---------------------------------------------------------------------------
// LiteLLM call
// ---------------------------------------------------------------------------

async function callQuantModel(
  quantModel: Model<Api>,
  apiKey: string | undefined,
  userContent: string,
  signal: AbortSignal | undefined,
): Promise<string> {
  const baseUrl = (quantModel as { baseUrl?: string }).baseUrl ?? "";
  const base = baseUrl.replace(/\/+$/, "");

  const body: Record<string, unknown> = {
    model: quantModel.id,
    messages: [
      { role: "system", content: QUANT_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    max_tokens: config.maxTokens,
    temperature: config.temperature,
  };

  // Combine external signal (from pi) with a hard timeout so a hung upstream
  // call cannot freeze the whole session. 180s cap per attempt; retries and
  // fallbacks cover transient unavailability.
  const timeoutSignal = AbortSignal.timeout(180_000);
  const combined =
    signal && typeof signal.aborted === "boolean"
      ? AbortSignal.any([signal, timeoutSignal])
      : timeoutSignal;

  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: combined,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Quant model returned ${response.status}: ${errBody.slice(0, 500)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string; reasoning_content?: string } }>;
  };

  const msg = json.choices?.[0]?.message;
  return msg?.content || msg?.reasoning_content || "(no response from quant model)";
}

/**
 * Try the configured model with retries; on 5xx errors, fall back through
 * the fallback model list, which is useful when an upstream endpoint is
 * transiently unavailable.
 */
async function callQuantWithFallbacks(
  ctx: {
    modelRegistry: {
      find(provider: string, model: string): Model<Api> | undefined;
      getApiKeyAndHeaders(model: Model<Api>): Promise<{ ok: boolean; apiKey?: string; error?: string }>;
    };
  },
  userContent: string,
  signal: AbortSignal | undefined,
  onUpdate?: (update: { content: Array<{ type: string; text: string }> }) => void,
): Promise<{ result: string; model: string }> {
  const provider = config.provider!;
  const candidates = [config.model!, ...(config.fallbacks ?? [])];
  const errors: string[] = [];

  for (const candidate of candidates) {
    const quantModel = ctx.modelRegistry.find(provider, candidate);
    if (!quantModel) {
      errors.push(`${candidate}: not in registry`);
      continue;
    }
    const auth = await ctx.modelRegistry.getApiKeyAndHeaders(quantModel);
    if (!auth.ok || !auth.apiKey) {
      errors.push(`${candidate}: auth failed`);
      continue;
    }
    for (let attempt = 0; attempt <= config.retries; attempt++) {
      try {
        onUpdate?.({
          content: [{ type: "text", text: `Running quant review with ${provider}/${candidate} (attempt ${attempt + 1})...` }],
        });
        const result = await callQuantModel(quantModel, auth.apiKey, userContent, signal);
        return { result, model: `${provider}/${candidate}` };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${candidate} attempt ${attempt + 1}: ${msg.slice(0, 150)}`);
        // only fall back on upstream/service errors (5xx); otherwise stop retrying this model
        if (!/returned 5/.test(msg) && !/ServiceUnavailable|APIConnection|503/.test(msg)) {
          break;
        }
      }
    }
  }

  throw new Error(`All quant models failed:\n${errors.join("\n")}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFileSafe(p: string): { ok: true; content: string } | { ok: false; error: string } {
  try {
    const content = readFileSync(p, "utf8");
    return { ok: true, content };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function configSummary(): string {
  return [
    "Quant review tool config:",
    `  provider: ${config.provider}`,
    `  model:    ${config.model}`,
    `  fallbacks: ${(config.fallbacks ?? []).join(", ") || "none"}`,
    `  maxTokens: ${config.maxTokens}`,
    `  retries: ${config.retries}`,
    `  enabled:  ${config.enabled}`,
    "",
    "Config file: ~/.pi/agent/quant-tool.json",
    "Change the model to point at a different entry in models.json.",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Extension entry point
// ---------------------------------------------------------------------------

export default function quantReviewToolExtension(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    config = resolveConfig();
  });

  pi.registerCommand("quant", {
    description: "Quant review tool settings (config, show, on, off, list)",
    handler: async (args, ctx) => {
      const trimmed = args?.trim() ?? "";
      if (!trimmed) {
        ctx.ui.notify(configSummary(), "info");
        return;
      }
      const [subcommand, key, ...rest] = trimmed.split(/\s+/);
      const value = rest.join(" ");

      // Helper: tampilkan selector model & set langsung ke config + simpan.
      const pickQuantModel = async (title: string): Promise<void> => {
        const models = ctx.modelRegistry.getAvailable();
        if (models.length === 0) {
          ctx.ui.notify("No models available. Check models.json.", "warning");
          return;
        }
        const current = config.model ?? "";
        const choices = models.map((m) => ({
          value: `${m.provider}/${m.id}`,
          label: `${m.id} (${m.provider})${m.id === current ? "  ← aktif" : ""}`,
        }));
        const choice = await ctx.ui.select(
          title,
          choices.map((c) => c.label),
          { timeout: 120_000 },
        );
        if (!choice) {
          ctx.ui.notify("Dibatalkan.", "info");
          return;
        }
        const sel = choices.find((c) => c.label === choice);
        if (!sel) return;
        const slash = sel.value.indexOf("/");
        config.provider = slash === -1 ? sel.value : sel.value.slice(0, slash);
        config.model = slash === -1 ? sel.value : sel.value.slice(slash + 1);
        writeConfig();
        ctx.ui.notify(`Quant model set to ${config.provider}/${config.model}`, "info");
      };

      switch (subcommand) {
        case "on":
          config.enabled = true;
          writeConfig();
          ctx.ui.notify("Quant review tool enabled.", "info");
          break;
        case "off":
          config.enabled = false;
          writeConfig();
          ctx.ui.notify("Quant review tool disabled.", "info");
          break;
        case "show":
        case "status":
          ctx.ui.notify(configSummary(), "info");
          break;
        case "list":
        case "models":
          await pickQuantModel("Pilih model quant reviewer:");
          break;
        case "config":
          if (key === "provider") {
            if (value) {
              config.provider = value;
              writeConfig();
              ctx.ui.notify(`Quant provider set to ${value}`, "info");
            } else {
              await pickQuantModel("Pilih model quant reviewer (provider+model):");
            }
          } else {
            // config model (dengan nilai) → set model; (tanpa nilai) → selector
            await pickQuantModel("Pilih model quant reviewer:");
          }
          break;
        default:
          ctx.ui.notify("Usage: /quant [show|on|off|list|config provider <p>|config model <m>]", "info");
      }
    },
  });

  function writeConfig() {
    try {
      writeFileSync(configFilePath(), JSON.stringify(config, null, 2) + "\n", "utf8");
    } catch {
      // ignore write errors
    }
  }

  pi.registerTool({
    name: "quant_review",
    label: "Quant Review",
    description: [
      "Run a scope-aware quantitative review using the configured quant model (real model delegation).",
      "Use this when a trading/ML experiment milestone/checklist completes and a quant review is needed before the next modeling/tuning decision.",
      "",
      "Arguments:",
      "- `analysis_packet`: path to the analysis packet file (JSON or markdown) containing deterministic metrics and a scope snapshot.",
      "- `scope_path` (optional): path to the EXPERIMENT_SCOPE.md file. If omitted, the tool looks for it at `ai/experiments/EXPERIMENT_SCOPE.md` relative to the working directory.",
      "",
      "The tool reads both files and sends them to the configured quant model (default cmd-deepseek-v4-pro via litellm, fallback cmd-deepseek-v4-flash — Command Code provider) with the scope-aware reviewer system prompt. It returns the structured verdict (VERDICT / IN_SCOPE_TUNING_RECOMMENDATIONS / EXECUTABLE_NEXT_ACTIONS / FUTURE_IMPROVEMENTS / ...) as a tool result.",
      "",
      "Configure via /quant or ~/.pi/agent/quant-tool.json.",
    ].join("\n"),
    promptSnippet: "Review trading experiment results with the quant reviewer (real model delegation)",
    promptGuidelines: [
      "Use quant_review after a meaningful milestone/backtest checklist completes, before the next modeling/tuning decision.",
      "Build a compact analysis packet (deterministic metrics + scope snapshot) first; do not send full logs.",
      "Pass the scope file path so the review is scope-aware.",
      "After the review, execute only IN_SCOPE_TUNING recommendations and persist out-of-scope ideas (do not execute them).",
      "Do not invoke this tool after every trial.",
    ],
    parameters: Type.Object({
      analysis_packet: Type.String({
        description:
          "Path to the analysis packet file (JSON or markdown) with deterministic metrics and scope snapshot.",
      }),
      scope_path: Type.Optional(
        Type.String({
          description:
            "Optional path to EXPERIMENT_SCOPE.md. Default: <cwd>/ai/experiments/EXPERIMENT_SCOPE.md",
        }),
      ),
    }),
    renderCall(args, theme, _context) {
      const modelLine = theme.fg("toolTitle", theme.bold(`quant_review via ${config.provider}/${config.model}`));
      const packetLine = theme.fg("dim", `analysis_packet: ${args.analysis_packet}`);
      const scopeLine = theme.fg("dim", `scope: ${args.scope_path ?? "ai/experiments/EXPERIMENT_SCOPE.md"}`);
      return new Text(`${modelLine}\n  ${packetLine}\n  ${scopeLine}`, 0, 0);
    },
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      if (!config.enabled) {
        return {
          content: [{ type: "text", text: "Quant review tool is disabled. Use /quant on to enable it." }],
          details: { error: "tool_disabled" },
          isError: true,
        };
      }
      if (!config.provider || !config.model) {
        return {
          content: [
            {
              type: "text",
              text: [
                "Quant review tool is not configured.",
                "Use /quant config provider <p> and /quant config model <m>,",
                "or edit ~/.pi/agent/quant-tool.json.",
              ].join("\n"),
            },
          ],
          details: { error: "not_configured" },
          isError: true,
        };
      }

      // Resolve the quant model is delegated to callQuantWithFallbacks
      // (tries config.model, then fallbacks, each with retries on 5xx).

      // Read the analysis packet
      const packet = readFileSafe(params.analysis_packet);
      if (!packet.ok) {
        return {
          content: [
            {
              type: "text",
              text: `Quant review tool error: could not read analysis packet "${params.analysis_packet}": ${packet.error}`,
            },
          ],
          details: { error: "packet_read_error" },
          isError: true,
        };
      }

      // Resolve scope path: explicit arg or default relative to cwd
      let scopePath = params.scope_path;
      if (!scopePath) {
        const cwd = process.cwd();
        const defaultScope = resolve(cwd, "ai", "experiments", "EXPERIMENT_SCOPE.md");
        if (existsSync(defaultScope)) scopePath = defaultScope;
      }

      let scopeText = "";
      if (scopePath) {
        const scope = readFileSafe(scopePath);
        if (scope.ok) {
          scopeText = scope.content;
        }
      }

      const userContent = [
        "EXPERIMENT SCOPE:",
        scopeText || "(no scope file found — if no scope is provided in the packet either, respond QUANT_REVIEW_BLOCKED: EXPERIMENT_SCOPE_MISSING)",
        "",
        "ANALYSIS PACKET:",
        packet.content,
      ].join("\n");

      onUpdate?.({
        content: [
          { type: "text", text: `Running quant review with ${config.provider}/${config.model}...` },
        ],
      });

      try {
        const { result, model } = await callQuantWithFallbacks(
          { modelRegistry: ctx.modelRegistry },
          userContent,
          signal,
          onUpdate,
        );
        return {
          content: [
            {
              type: "text",
              text: `[quant_review by ${model}]
\n${result}`,
            },
          ],
          details: {
            model,
            analysis_packet: params.analysis_packet,
            scope_path: scopePath ?? null,
          },
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Quant review tool error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          details: { error: "quant_call_error" },
          isError: true,
        };
      }
    },
  });
}
