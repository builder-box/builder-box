# builder-box

A development kit with modules, components, and libraries that will allow you to develop robust
applications quickly and easily.

## Requirements

- [Node.js](https://nodejs.org/) `24.20.0` (see `.nvmrc`)
- [pnpm](https://pnpm.io/) `12.4.1` (see `packageManager` in `package.json`)
- [Corepack](https://nodejs.org/api/corepack.html) enabled: `corepack enable`

## Structure

```
.
├── packages/            # Monorepo packages (e.g. @builder-box/core)
├── .github/workflows/   # GitHub Actions pipelines (ci.yaml, cd.yaml)
├── .husky/              # Git hooks (pre-commit, pre-push, commit-msg)
├── eslint.config.mjs    # ESLint (flat config)
├── pnpm-workspace.yaml  # Workspaces + pnpm settings + catalog
├── tsconfig.base.json   # Shared TypeScript base
└── vitest.config.ts     # Vitest projects + coverage (100%)
```

## Commands

All commands run from the repository root. For a single package:
`pnpm --filter @builder-box/core <script>`.

| Command             | Description                                       |
| ------------------- | ------------------------------------------------- |
| `pnpm build`        | Build every package (Vite + `.d.ts` declarations) |
| `pnpm dev`          | Build in watch mode                               |
| `pnpm typecheck`    | Type-check (root + packages)                      |
| `pnpm lint`         | ESLint                                            |
| `pnpm lint:fix`     | ESLint with autofix                               |
| `pnpm format`       | Format with Prettier                              |
| `pnpm format:check` | Check formatting                                  |
| `pnpm test`         | Unit tests (Vitest)                               |
| `pnpm test:cov`     | Tests + coverage (writes `coverage/lcov.info`)    |
| `pnpm clean`        | Remove build and coverage artifacts               |

## Tooling

- **Build**: [Vite 8](https://vite.dev/) in library mode (Rolldown) + `tsc` for `.d.ts`.
- **Tests**: [Vitest 5](https://vitest.dev/) with **100%** coverage (Codecov).
- **Quality**: [ESLint](https://eslint.org/) (flat config) + [Prettier](https://prettier.io/).
- **Git hooks**: [Husky](https://typicode.github.io/husky/) +
  [lint-staged](https://github.com/lint-staged/lint-staged) +
  [commitlint](https://commitlint.js.org/). Hooks do not run in CI.
- **Release**: [Changesets](https://github.com/changesets/changesets).

## Publishing

Publishable packages declare `publishConfig.access = "public"` and `files: ["dist"]`. The release
flow will be managed from `.github/workflows/cd.yaml`.

## Contributing

See [`AGENTS.md`](./AGENTS.md) for repository rules and conventions.

## License

[MIT](./LICENSE)
