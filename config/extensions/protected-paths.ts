/**
 * Protected Paths Extension
 *
 * Blocks write and edit operations to protected paths.
 * Paths based on the PI Coding Executor Setup Blueprint:
 *   .env, .git/, *.pem, *.key, credentials/, secrets/, production-secrets/
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	const protectedPaths = [
		".env",
		".git/",
		"node_modules/",
		".pem",
		".key",
		"credentials/",
		"secrets/",
		"production-secrets/",
	];

	pi.on("tool_call", async (event, ctx) => {
		if (event.toolName !== "write" && event.toolName !== "edit") {
			return undefined;
		}

		const path = event.input.path as string;
		const isProtected = protectedPaths.some((p) => path.includes(p));

		if (isProtected) {
			if (ctx.hasUI) {
				ctx.ui.notify(`Blocked write to protected path: ${path}`, "warning");
			}
			return { block: true, reason: `Path "${path}" is protected` };
		}

		return undefined;
	});
}