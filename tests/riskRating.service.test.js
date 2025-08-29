/**
 * Unit tests for the riskRating() function.
 *
 * These focus on the pure logic:
 * - matching real words with endings
 * - avoiding false positives (e.g., "bumper") - edge case
 * - clamping to [1..5]
 * - handling invalid inputs
 */
const { riskRating } = require("../services/riskRating");

describe("riskRating (service)", () => {
    test("counts keywords & variants", () => {
        const txt = "A crash scratched the door; two crashes later; smashed mirror.";
        expect(riskRating(txt)).toBe(4); // crash, scratched, crashes, smashed
    });

    test("no occurrences returns minimum 1", () => {
        expect(riskRating("Windscreen replaced only.")).toBe(1);
    });

    test("clamps above five", () => {
        const txt = "crash crash crash crash crash crash";
        expect(riskRating(txt)).toBe(5);
    });

    test("does not count 'bumper' as 'bump'", () => {
        expect(riskRating("Replaced the bumper, no incidents.")).toBe(1);
    });

    test("invalid input throws", () => {
        expect(() => riskRating("")).toThrow(/non-empty/);
        expect(() => riskRating(42)).toThrow(/non-empty/);
    });
    test("collide variants (collided + collisions)", () => {
    expect(riskRating("They collided. Multiple collisions after.")).toBe(2);
    });

    test("counts across punctuation and newlines", () => {
    expect(riskRating("crash! crash? (crashed)\nSMASHING later")).toBe(4);
    });

    test("hyphenated still matches the word", () => {
    expect(riskRating("A crash-related incident; bumper replaced.")).toBe(1); // 1 for 'crash'; 'bumper' ignored
    });

    test("does not count crashlytics/scratchpad/bumper", () => {
    // zero matches → function floors to 1
    expect(riskRating("Installed Crashlytics; opened a scratchpad; bumper-to-bumper traffic")).toBe(1);
    });

    test("very long input clamps to 5", () => {
    expect(riskRating(("crash ".repeat(50)).trim())).toBe(5);
    });
});
