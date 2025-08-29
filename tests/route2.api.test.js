/**
 * API tests for POST /route2/api/v1/risk-rating
 *
 * These verify:
 * - the endpoint path and JSON shape
 * - success case returns numeric rating
 * - invalid input returns HTTP 400 with an error message
 */

const request = require("supertest");
const app = require("../index");

describe("POST /route2/api/v1/risk-rating", () => {
  test("returns risk_rating=3 for the sample text", async () => {
    const payload = {
      claim_history:
        "My only claim was a crash into my house's garage door that left a scratch on my car. There are no other crashes."
    };
    const res = await request(app)
      .post("/route2/api/v1/risk-rating")   // <-- prefix with /route2
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ risk_rating: 3 });
  });

  test("400 on empty claim_history", async () => {
    const res = await request(app)
      .post("/route2/api/v1/risk-rating")   // <-- prefix with /route2
      .send({ claim_history: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/non-empty/);
  });
  test("400 on missing claim_history", async () => {
    const res = await request(app).post("/route2/api/v1/risk-rating").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/non-empty/i);
  });

  test("400 on whitespace-only", async () => {
    const res = await request(app)
      .post("/route2/api/v1/risk-rating")
      .send({ claim_history: "   " });
    expect(res.statusCode).toBe(400);
  });

});
