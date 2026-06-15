#!/usr/bin/env node

import { downloadTemplate } from "giget";
import prompts from "prompts";
import fs from "fs";
import path from "path";

// ── Colors (no dependency) ──────────────────────────────────────────
const bold = (t) => `\x1b[1m${t}\x1b[22m`;
const cyan = (t) => `\x1b[36m${t}\x1b[39m`;
const green = (t) => `\x1b[32m${t}\x1b[39m`;
const red = (t) => `\x1b[31m${t}\x1b[39m`;
const dim = (t) => `\x1b[2m${t}\x1b[22m`;
const yellow = (t) => `\x1b[33m${t}\x1b[39m`;

// ── Banner ──────────────────────────────────────────────────────────
function printBanner() {
	console.log();
	console.log(cyan(bold("  create-luau-app")));
	console.log(dim("  Scaffold a new Roblox Luau project"));
	console.log();
}

// ── Helpers ─────────────────────────────────────────────────────────
function isValidPackageName(name) {
	return /^[a-z0-9_-]+$/.test(name);
}

function toValidPackageName(name) {
	return name
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9_-]/g, "");
}

function isEmpty(dirPath) {
	if (!fs.existsSync(dirPath)) return true;
	const files = fs.readdirSync(dirPath);
	return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

// ── Template patching ───────────────────────────────────────────────
function patchFile(filePath, replacements) {
	if (!fs.existsSync(filePath)) return;
	let content = fs.readFileSync(filePath, "utf-8");
	for (const [search, replace] of replacements) {
		content = content.replaceAll(search, replace);
	}
	fs.writeFileSync(filePath, content, "utf-8");
}

function patchProjectName(projectDir, projectName) {
	const wallyName = `kryisnn/${projectName}`;

	patchFile(path.join(projectDir, "default.project.json"), [
		["luau-boilerplate", projectName],
	]);

	patchFile(path.join(projectDir, "wally.toml"), [
		["kryisnn/luau-boilerplate", wallyName],
	]);

	// Update package.json name
	const pkgPath = path.join(projectDir, "package.json");
	if (fs.existsSync(pkgPath)) {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
		pkg.name = projectName;
		fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, "\t") + "\n", "utf-8");
	}

	// Update README title
	patchFile(path.join(projectDir, "README.md"), [
		["# My Luau App", `# ${projectName}`],
	]);
}

function patchWallyDeps(projectDir, options) {
	const wallyPath = path.join(projectDir, "wally.toml");
	if (!fs.existsSync(wallyPath)) return;

	let content = fs.readFileSync(wallyPath, "utf-8");

	if (!options.includePromise) {
		content = content.replace(
			/Promise = "cometahn142\/promise@[^"]+"\n?/,
			"",
		);
	}

	if (!options.includeProfileService) {
		content = content.replace(
			/ProfileService = "firebird702\/profileservice@[^"]+"\n?/,
			"",
		);
	}

	// Clean up empty sections
	content = content.replace(/\[dependencies\]\s*\n(?=\[|\s*$)/, "");
	content = content.replace(/\[server-dependencies\]\s*\n(?=\[|\s*$)/, "");
	// Trim trailing whitespace
	content = content.trimEnd() + "\n";

	fs.writeFileSync(wallyPath, content, "utf-8");
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
	printBanner();

	// If a directory name was passed as an argument, use it as default
	const argDir = process.argv[2];
	const defaultName = argDir || "my-luau-app";

	let result;

	try {
		result = await prompts(
			[
				{
					type: argDir ? null : "text",
					name: "projectName",
					message: "Project name:",
					initial: defaultName,
					validate: (value) =>
						isValidPackageName(toValidPackageName(value))
							? true
							: "Invalid name. Use lowercase letters, numbers, hyphens, or underscores.",
				},
				{
					type: "confirm",
					name: "includePromise",
					message: "Include Promise library?",
					initial: true,
				},
				{
					type: "confirm",
					name: "includeProfileService",
					message: "Include ProfileService?",
					initial: true,
				},
			],
			{
				onCancel: () => {
					console.log(red("\n✖ Operation cancelled."));
					process.exit(0);
				},
			},
		);
	} catch (err) {
		console.log(red("\n✖ Operation cancelled."));
		process.exit(0);
	}

	const projectName = toValidPackageName(argDir || result.projectName);
	const targetDir = path.resolve(process.cwd(), projectName);

	// Check if directory is empty
	if (!isEmpty(targetDir)) {
		const { overwrite } = await prompts({
			type: "confirm",
			name: "overwrite",
			message: `Directory ${yellow(projectName)} is not empty. Overwrite?`,
			initial: false,
		});

		if (!overwrite) {
			console.log(red("\n✖ Operation cancelled."));
			process.exit(0);
		}

		// Clean the directory
		fs.rmSync(targetDir, { recursive: true, force: true });
	}

	console.log();
	console.log(`  ${dim("Scaffolding project in")} ${cyan(targetDir)}${dim("...")}`);
	console.log();

	try {
		await downloadTemplate("github:davindakhrisna/create-luau-app/template", {
			dir: targetDir,
			forceClean: true,
		});

		// Patch project name
		patchProjectName(targetDir, projectName);

		// Patch wally dependencies based on user choices
		patchWallyDeps(targetDir, {
			includePromise: result.includePromise,
			includeProfileService: result.includeProfileService,
		});

		console.log(green(bold("  ✔ Project created successfully!")));
		console.log();
		console.log("  Next steps:");
		console.log();
		console.log(`    ${cyan(`cd ${projectName}`)}`);
		console.log(`    ${cyan("pnpm install")}`);
		console.log(`    ${cyan("pnpm wally")}`);
		console.log(`    ${cyan("pnpm dev")}`);
		console.log();
		console.log(dim("  Happy coding! 🎮"));
		console.log();
	} catch (err) {
		console.error(red("\n  ✖ Failed to create project:\n"));
		console.error(`  ${err.message}`);
		console.log();
		process.exit(1);
	}
}

main();
