# create-luau-app

Scaffold a new Roblox Luau project with [Rojo](https://rojo.space/), [Wally](https://wally.run/), and [Selene](https://kampfkarren.github.io/selene/) — all set up and ready to go.

## Usage

```bash
pnpm create create-luau-app
```

Or with a project name:

```bash
pnpm create create-luau-app my-game
```

You can also use npm or yarn:

```bash
# npm
npm create create-luau-app@latest

# yarn
yarn create create-luau-app
```

## What You Get

- **Rojo** project structure (client / server / shared)
- **Wally** package manager with optional packages:
  - [Promise](https://eryn.io/roblox-lua-promise/) — async utility
  - [ProfileService](https://madstudioroblox.github.io/ProfileService/) — data persistence
- **Selene** linter configured for Roblox
- **Rokit** toolchain manager
- **pnpm scripts** for build, serve, and dev workflow

## Project Structure

```
my-game/
├── src/
│   ├── client/     → StarterPlayerScripts
│   ├── server/     → ServerScriptService
│   └── shared/     → ReplicatedStorage
├── assets/
│   └── Maps/
├── default.project.json
├── wally.toml
├── rokit.toml
├── selene.toml
├── package.json
└── README.md
```

## License

MIT © Davinda Khrisna Adyatma
