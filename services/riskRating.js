/**
 * Risk rating service
 *
 * How it works:
 * - We scan a free-text claim history and count how many times
 *   risky words appear (e.g., "crash", "scratched", "collisions").
 * - Each occurrence adds +1 to the score.
 * - We then clamp the final score to 1..5.
 * 
 * - We want to match the real word with simple endings:
 *     crash, crashes, crashed, crashing
 *   and avoid false positives:
 *     "crashlytics" (NOT a crash), "bumper" (NOT bump)
 * - `\b` = word boundary, so we only count whole words (with endings).
 * - `(?: ... )?` = an optional non-capturing group for endings like -ed, -es, -ing.
 */
const REGEXES = [
  /\bcrash(?:es|ed|ing)?\b/gi,
  /\bscratch(?:es|ed|ing)?\b/gi,
  /\bbump(?:s|ed|ing)?\b/gi,               // won't match 'bumper'
  /\bsmash(?:es|ed|ing)?\b/gi,
  /\bcolli(?:de|ded|des|ding|sion|sions)\b/gi,  // collision/s included
];
/**
 * Convert a claim-history sentence into a risk rating (1 to 5).
 * @param {string} text
 * @returns {number} rating between 1 (low risk) and 5 (high risk)
 * @throws {Error} if text is not a non-empty string
 */

function riskRating(text) {
  // Basic input validation with a helpful error code for the API layer.
  if (typeof text !== "string" || !text.trim()) {
    const err = new Error("claim_history must be a non-empty string");
    err.code = "INVALID_INPUT";
    throw err;
  }
  // Count total matches across all keywords and their simple variants.
  let count = 0;
  for (const rx of REGEXES) {
    const m = text.match(rx);
    if (m) count += m.length;
  }
  return Math.min(5, Math.max(1, count)); // clamp 1..5
}

module.exports = { riskRating };
