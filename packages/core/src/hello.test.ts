import { describe, expect, it } from "vitest";

import { greet } from "./hello";

describe("greet", () => {
  it("greets the provided name", () => {
    expect(greet({ name: "Ada" })).toBe("Hello, Ada!");
  });

  it("ignores surrounding whitespace", () => {
    expect(greet({ name: "  Ada  " })).toBe("Hello, Ada!");
  });

  it('falls back to "world" when the name is blank', () => {
    expect(greet({ name: "   " })).toBe("Hello, world!");
  });
});
