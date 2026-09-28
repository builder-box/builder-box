import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Vitest 5 uses `projects`; `workspace`/`vitest.workspace.ts` no longer exist.
    projects: ["packages/*"],
    coverage: {
      provider: "v8",
      // `lcov` writes coverage/lcov.info, which is what Codecov consumes.
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["packages/*/src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts", "**/*.d.ts", "**/index.ts", "**/node_modules/**"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
        perFile: true,
      },
    },
  },
});
