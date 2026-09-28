import { readFileSync } from "node:fs";
import { builtinModules } from "node:module";

import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Externalize Node builtins and the declared dependencies/peers so they are not bundled
// into the published library.
const external = [
  ...builtinModules,
  ...builtinModules.map((mod) => `node:${mod}`),
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
].map((dep) => new RegExp(`^${escapeRegExp(dep)}(/.*)?$`));

export default defineConfig({
  build: {
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rolldownOptions: {
      external,
    },
  },
});
