/**
 * Permission Gate Extension
 *
 * Policy:
 *  - AUTO  : command aman/umum → langsung jalan (tanpa konfirmasi).
 *            ls, grep, git status, git diff, test/build, docker compose ...,
 *            sudo systemctl restart ..., sudo docker ..., sudo apt ...,
 *            sudo journalctl ..., dst.
 *  - ASK/BLOCK : command destruktif → di interactive mode tanya konfirmasi,
 *            di mode non-interactive diblokir.
 *            rm -rf, git reset --hard, git clean -fd, git push --force,
 *            DROP DATABASE, TRUNCATE, docker system prune, mkfs, dd ke /dev/*,
 *            dst.
 *
 * Command yang TIDAK match pola destruktif = auto-dijalankan (whitelist implicit).
 *
 * AUTO-APPROVE per pane (toggle di dashboard): kalau pane tmux tempat pi ini
 * berjalan di-ON-kan lewat dashboard (endpoint /pi/auto-approve), konfirmasi
 * destruktif dijawab otomatis "Yes" — jadi tidak nunggu user yang sedang tidak
 * di tempat. Identitas agent = $TMUX_PANE (bukan nama session: grouped session
 * membuat nama session tidak bisa dipakai sebagai identitas).
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { appendFileSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// ===== Auto-approve per pane =====
// File state ini juga ditulis dashboard lewat tmux-state-server.py
// (/pi/auto-approve). Format: {"%2": true, "%9": true}
const AUTO_APPROVE_FILE = process.env.PI_AUTO_APPROVE_FILE
	|| join(homedir(), ".pi", "agent", "auto-approve.json");
const AUTO_APPROVE_LOG = join(homedir(), ".pi", "agent", "auto-approve.log");

function autoApproveFor(pane: string | undefined): boolean {
	if (!pane) return false;
	try {
		const raw = JSON.parse(readFileSync(AUTO_APPROVE_FILE, "utf8")) as Record<string, unknown>;
		return !!raw && raw[pane] === true;
	} catch {
		return false;
	}
}

/** Audit trail: perintah destruktif apa saja yang dijalankan tanpa konfirmasi. */
function logAutoApprove(pane: string, command: string) {
	try {
		appendFileSync(
			AUTO_APPROVE_LOG,
			`${new Date().toISOString()}\t${pane}\t${command.replace(/\s+/g, " ").slice(0, 400)}\n`,
		);
	} catch {
		// logging best-effort, jangan sampai memblokir tool call
	}
}

export default function (pi: ExtensionAPI) {
	// ===== ASK / BLOCK: pola destruktif =====
	const destructivePatterns: RegExp[] = [
		// rm rekursif/paksa: rm -r, rm -rf, rm -fr, rm --recursive, rm -R
		/\brm\s+(-[a-zA-Z]*r[a-zA-Z]*|--recursive|--force)/i,
		/\brm\s+.*\/\*\s*$/i, // rm dir/*
		// git destruktif
		/\bgit\s+reset\s+--hard\b/i,
		/\bgit\s+clean\s+-(f|f?d|f?dx|ffd|ffdx)\b/i,
		/\bgit\s+push\s+.*(--force|-f\b)/i,
		/\bgit\s+checkout\s+--\s/i, // discards working tree changes
		// database destruktif
		/\bDROP\s+DATABASE\b/i,
		/\bTRUNCATE\b/i,
		/\bDELETE\s+FROM\b/i,
		// docker destruktif
		/\bdocker\s+system\s+prune\b/i,
		/\bdocker\s+volume\s+rm\b/i,
		/\bdocker\s+compose\s+down\s+.*(-v|--volumes)\b/i,
		/\bdocker\s+rm\s+-f\b/i,
		// disk/device destruktif
		/\bmkfs\b/i,
		/\bdd\b.*\bof=\/dev\//i,
		/\b(fdisk|parted|gdisk|sfdisk)\b.*\bwipe/i,
		/\bwipefs\b/i,
		// permission terkunci
		/\b(chmod|chown)\b.*777/i,
	];

	// ===== AUTO: command aman yang eksplisit (documentation; tidak diblokir) =====
	// ls, grep, git status/diff, test/build, docker compose, sudo systemctl
	// restart/status, sudo docker, sudo apt, sudo journalctl — semuanya TIDAK
	// match destructivePatterns, jadi otomatis diizinkan. Daftar ini dokumentasi
	// dan future-proofing bila pola baru ditambahkan.
	const autoPatterns: RegExp[] = [
		/\bls\b/,
		/\bgrep\b/,
		/\bgit\s+status\b/,
		/\bgit\s+diff\b/,
		/\b(test|build|pytest|npm\s+test|go\s+test|cargo\s+(test|build))\b/,
		/\bdocker\s+compose\b/,
		/\bsudo\s+systemctl\s+(restart|status|start|stop|reload)\b/,
		/\bsudo\s+docker\b/,
		/\bsudo\s+apt\b/,
		/\bsudo\s+journalctl\b/,
	];

	/**
	 * Cek apakah command destruktif. Command yang cocok dengan auto list memang
	 * diperbolehkan; hanya pola destruktif yang memicu konfirmasi.
	 */
	function requiresConfirmation(command: string): boolean {
		return destructivePatterns.some((p) => p.test(command));
	}

	pi.on("tool_call", async (event, ctx) => {
		if (event.toolName !== "bash") return undefined;

		const command = event.input.command as string;
		if (!requiresConfirmation(command)) {
			// AUTO: izinkan langsung
			return undefined;
		}

		// Auto-approve aktif untuk pane ini? -> jawab "Yes" otomatis.
		// Dicek SEBELUM cabang !hasUI supaya toggle juga berlaku di mode
		// non-interactive (pi -p) yang jalan di pane tersebut.
		const pane = process.env.TMUX_PANE;
		if (autoApproveFor(pane)) {
			logAutoApprove(pane as string, command);
			if (ctx.hasUI) {
				ctx.ui.notify(`⚡ auto-approve (${pane}): ${command.slice(0, 70)}`, "warning");
			}
			return undefined;
		}

		if (!ctx.hasUI) {
			// Non-interactive mode: block
			return { block: true, reason: `Dangerous command blocked (no UI for confirmation): ${command}` };
		}

		const choice = await ctx.ui.select(`⚠️ Dangerous command:\n\n  ${command}\n\nAllow?`, ["Yes", "No"]);

		if (choice !== "Yes") {
			return { block: true, reason: "Blocked by user" };
		}

		return undefined;
	});
}