# My Luau App

Scaffolded with [create-luau-app](https://github.com/davindakhrisna/create-luau-app).

## Getting Started

```bash
# Install Node dependencies
pnpm install

# Install Wally packages
pnpm wally

# Build & serve with Rojo
pnpm dev
```

## Opening in Studio

```bash
# Build the .rbxl file and open in Roblox Studio
pnpm export
```

## Project Structure

```
src/
├── client/     → StarterPlayerScripts
├── server/     → ServerScriptService
└── shared/     → ReplicatedStorage
```

## Tools

- [Rojo](https://rojo.space/) — Sync code to Roblox Studio
- [Wally](https://wally.run/) — Package manager for Roblox
- [Selene](https://kampfkarren.github.io/selene/) — Luau linter
- [Rokit](https://github.com/rojo-rbx/rokit) — Toolchain manager

## Adding Packages

Edit `wally.toml` to add dependencies, then run:

```bash
pnpm wally
```
