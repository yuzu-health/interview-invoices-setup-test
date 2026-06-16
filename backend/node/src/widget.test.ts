import { describe, it, expect } from "vitest";

// A trivial pure-logic test so `npm run test:node` exercises vitest + tsx
// without touching the database. If this runs, the test toolchain works.
function nextCount(current: number, delta: number): number {
  return current + delta;
}

describe("preflight", () => {
  it("runs the test toolchain", () => {
    expect(nextCount(2, 3)).toBe(5);
  });
});
