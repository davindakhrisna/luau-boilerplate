#!/usr/bin/env node

import { downloadTemplate } from "giget";
import path from "path";

async function main() {
	const targetDir = process.argv[2] || "my-luau-app";
	const resolvedTargetDir = path.resolve(process.cwd(), targetDir);

	console.log(`🚀 Creating a new Luau app in ${resolvedTargetDir}...`);

	try {
		await downloadTemplate("github:davindakhrisna/create-luau-app", {
			dir: resolvedTargetDir,
		});

		console.log("\n🎉 Success! Your Luau project is ready.");
		console.log(
			`\nNext steps:\n  cd ${targetDir}\n  pnpm install\n pnpm wally\n pnpm dev`,
		);
	} catch (err) {
		console.error("❌ Failed to create project:", err);
		process.exit(1);
	}
}

main();
