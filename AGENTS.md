# AGENTS.md

Guidance for AI agents (Zed, Claude Code, Codex, Cursor, …) working in this repository.

## What this project is

`builder-box` is a _development kit_: a monorepo of modules, components, and libraries published
under the `@builder-box/*` scope.

| Area        | Choice                                             |
| ----------- | -------------------------------------------------- |
| Runtime     | Node.js `24.20.0` (see `.nvmrc`)                   |
| Package mgr | **pnpm** `12.4.1` (required, see `packageManager`) |
| Language    | TypeScript (ESM, no CommonJS)                      |
| Build       | Vite 8 (library mode, Rolldown)                    |
| Tests       | Vitest 5 with **100%** coverage                    |
| Quality     | ESLint (flat config) + Prettier                    |
| Release     | Changesets                                         |

## Language

**All documentation and all code in this repository are written in English**, including:

- identifiers, types, and public APIs;
- inline comments and JSDoc;
- commit messages, branch names, and pull requests;
- documentation, READMEs, changesets, and `TODO` notes.

Spanish is fine for day-to-day conversation with the maintainer, but never for committed artifacts.

## Requirements

- Run `corepack enable` before working.
- **Do not** use `npm` or `yarn`: the `devEngines` field in `package.json` blocks them on purpose.

## Structure

```
.
├── packages/                  # Monorepo packages (@builder-box/*)
│   └── core/                  # Seed package (configuration reference)
├── .github/workflows/         # ci.yaml, cd.yaml
├── .husky/                    # pre-commit, pre-push, commit-msg
├── .changeset/                # Changesets configuration
├── eslint.config.mjs          # ESLint flat config
├── pnpm-workspace.yaml        # Workspaces + pnpm settings + catalog
├── tsconfig.base.json         # Shared TypeScript base
├── vitest.config.ts           # Projects + coverage
└── package.json
```

## Commands

All commands run **from the repository root**. For a single package:
`pnpm --filter @builder-box/core <script>`.

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `pnpm install`      | Install dependencies                           |
| `pnpm build`        | Build every package (Vite + `.d.ts`)           |
| `pnpm dev`          | Build in watch mode                            |
| `pnpm typecheck`    | Type-check (root + packages)                   |
| `pnpm lint`         | ESLint                                         |
| `pnpm lint:fix`     | ESLint with autofix                            |
| `pnpm format`       | Format with Prettier                           |
| `pnpm format:check` | Check formatting                               |
| `pnpm test`         | Unit tests                                     |
| `pnpm test:cov`     | Tests + coverage (writes `coverage/lcov.info`) |
| `pnpm clean`        | Remove build and coverage artifacts            |

## Workflow

### Jira

Work is tracked in **Jira**, in the **BBX** project. Ticket keys look like `BBX-123`.

- Jira project: <https://builder-box.atlassian.net/jira/software/projects/BBX>

- Use the available Jira tooling to read ticket context (summary, acceptance criteria, status,
  links) when the task maps to a ticket.
- Every unit of work should map to a BBX ticket, and the ticket key must appear in the branch name.
- Do not create, edit, or transition Jira issues unless explicitly asked.

### Branches

Branch names follow this pattern:

```
<feat|fix|chore>/<JIRA-TICKET>[-<short-desc>]
```

- `<JIRA-TICKET>` is a `BBX-<number>` key.
- `<short-desc>` is optional and `kebab-case`.
- Examples: `feat/BBX-1`, `feat/BBX-1-fix-dependency-vulnerabilities`, `chore/BBX-42-bump-pnpm`.
- Never commit directly to `main`.

The branch carries the change type (`feat`, `fix`, `chore`); the commit message carries the Jira
ticket instead of a Conventional Commits type.

### Commits

- Commit messages start with the Jira ticket: `<BBX-NNN>: <subject>`.
  - Example: `BBX-1: update dependencies to fix vulnerabilities`
  - Enforced by commitlint through the `commit-msg` hook.
- **All commits must be signed.** Unsigned commits are rejected on `main` by the branch ruleset
  (see [Protected branches](#protected-branches)).

#### Signing setup

Configure signing once; the settings below are the repository defaults.

**GPG:**

```sh
git config --local commit.gpgsign true
git config --local gpg.format openpgp
git config --local user.signingkey <key-id>
```

**SSH:**

```sh
git config --local commit.gpgsign true
git config --local gpg.format ssh
git config --local user.signingkey <path-to-public-key>
```

- Add the **public** key to GitHub (`Settings → SSH and GPG keys`) as a _signing key_.
- **Verify** with `git log --show-signature` (or `git log --no-pager --show-signature`) and confirm the
  signature line reports `Good signature`.
- If a commit is rejected as unsigned, check that the signing key matches the public key registered
  on GitHub and that `commit.gpgsign` is `true` in the effective config.

### Protected branches

`main` is protected by a **repository ruleset** (no bypass actors). It enforces:

| Rule                     | Effect                                                 |
| ------------------------ | ------------------------------------------------------ |
| `pull_request`           | Changes reach `main` only through a PR (squash/rebase) |
| `required_signatures`    | Commits must be signed                                 |
| `required_status_checks` | The CI check must pass before merging                  |
| `non_fast_forward`       | Force pushes are blocked                               |
| `deletion`               | The `main` branch cannot be deleted                    |

- The required status check is **`Lint, typecheck, test & build`** (the `name` of the CI job). A PR is
  blocked while that check is missing, running, or failing.
- The ruleset sets `strict_required_status_checks_policy`: the PR branch must be up to date with
  `main` before merging.
- Because there are no bypass actors, **bots that push without signing are rejected**. If a bot
  (e.g. Dependabot) needs to merge, add it as a bypass actor on the ruleset.
- The ruleset is configured in the GitHub UI/API; it is **not** stored in the repository.

## Repository rules

### pnpm

- pnpm configuration lives in **`pnpm-workspace.yaml`** (camelCase keys). `.npmrc` is **only** for
  registry auth/credentials.
- Dependency versions are centralized in the **catalog** of `pnpm-workspace.yaml` and referenced
  with `"catalog:"` in each `package.json`. Do not hardcode versions.
- If `pnpm install` reports ignored build scripts, approve the package in `allowBuilds`
  (do not disable the protection).

### TypeScript

- Pure ESM (`"type": "module"`). Do not add CommonJS output.
- Every `tsconfig` extends `tsconfig.base.json`.
- **Do not change the `typescript` version**: TS 7 is the native port and **exposes no API**. That is
  why `typescript` is aliased to `@typescript/typescript6` (the TS 6 API, used by `typescript-eslint`)
  and `@typescript/native` provides the TS 7 `tsc` binary. Changing this breaks linting.
- `types` must be listed explicitly (`["node"]`): in TS 7 the default is `[]`.

### Build (Vite 8)

- Use `build.rolldownOptions` (NOT `rollupOptions`) and the root `oxc` option (NOT `esbuild`).
- Libraries are built in library mode and externalize dependencies/peers
  (see `packages/core/vite.config.ts` as the reference).
- `.d.ts` declarations are emitted by `tsc -p tsconfig.build.json`, not by a plugin.
- Every publishable package declares `exports`, `files: ["dist"]`, `sideEffects: false`, and
  `publishConfig.access: "public"`.

### Tests and coverage

- Coverage is a **hard 100% per file** (`perFile`). A change that lowers it fails CI.
- Tests live next to the code, in `src/**/*.test.ts`.
- Barrels (`**/index.ts`) are excluded from coverage: put logic in separate modules.

### Style

- Prettier owns formatting (double quotes, 100 columns, `lf`). Do not hand-format what
  `pnpm format` does.
- ESLint runs type-aware rules and import ordering (`import-x`).

### Git hooks

- `pre-commit` → lint-staged · `pre-push` → tests · `commit-msg` → commitlint.
- Hooks do **not** run in CI (`CI=true` skips them). Do not edit them without a reason.

## Adding a new package

1. `packages/<name>/package.json` → name `@builder-box/<name>`, `type: module`, `license: MIT`,
   devDependencies using `"catalog:"`.
2. `tsconfig.json` + `tsconfig.build.json` extending `../../tsconfig.base.json`.
3. `vite.config.ts` (library mode) and `vitest.config.ts` (with `name`).
4. `src/` with the implementation and its tests (100% coverage).
5. If a new dependency is needed, **add it to the catalog** in `pnpm-workspace.yaml`.

## What you must NOT do

- Do not `git commit`, `push`, or create branches unless explicitly asked.
- Do not commit directly to `main`, create unsigned commits, or use branch names outside the
  pattern above; do not write commit messages without the `BBX-<number>: ` prefix.
- Do not change the `typescript` version, the license (MIT), or the `@builder-box` scope name.
- Do not hardcode secrets or tokens; ask if a credential is required.
- Do not add dependencies outside the catalog or bypass install-script approval.
- Do not disable ESLint rules or coverage thresholds to "make a change pass".
- Keep changes minimal and surgical, respecting the existing style.
