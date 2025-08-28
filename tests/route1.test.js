//? =====================================================================
//? API 1. Convert "Model" and "Year" of a car to a suggested "Car Value"
//? =====================================================================

//? --------------
//? -- OVERVIEW --
//? --------------

//? API takes 2 parameters as input in JSON format
//? INPUT: includes the "model" (e.g. "Civic") and a numeric "year" of a car (e.g. 2014)
//? OUTPUT: is a JSON format with the suggested value for the car, such as "$6,614"

//todo --------------------
//todo -- BUSINESS RULES --
//todo --------------------
/*
Car_value is calculated by adding up the positions of alphabets of the letters in the name, times a hundred, and add the year value.  
Position of alphabet means the letter in the order of alphabets (e.g. A is the first letter, so it is 1.  Z is the last letter, so it is 26).  
Space and any other signs are ignored. For example, a "Civic" in year 2014 will be worth (3 + 9 + 22 + 9 + 3) * 100 + 2014 = $6,614.  
If input values are not valid, return an error
*/
//? =======================================================================

const request = require("supertest");
const app = require("../index");

describe("Car Value Suggestion", () => {
  //* ========================
  //* == Sunny day scenario ==
  //* ========================
  // When both model and year are provided and valid
  // API should return correct suggested car value
  // - Each letter's alphabetical position is summed- (C=3, I=9, V=22, I=9, C=3)
  // - The sum is multiplied by 100 and the year is added:
  //   (3 + 9 + 22 + 9 + 3) * 100 + 2014 = $6,614

  describe("Sunny Day Scenarios", () => {
    test("Should return the correct suggested car value for a valid model and year input: (Civic, 2014) Value: $6,614", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "Civic", year: 2014 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ suggestedValue: "6614" });
    });

    test("Should return the correct suggested car value for another valid model and year: (Hilux, 2025) Value: $9,425", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "Hilux", year: 2025 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ suggestedValue: "9425" });
    });
  });

  //* ========================
  //* ==    Numbers Only    ==
  //* ========================
  // - Only letters contribute to the sum (A=1, B=2, etc.)
  // - Numbers and special characters are ignored
  // - For models with only numbers (e.g., "911"), the letter sum is 0
  // - So the formula becomes: 0*100 + year = year
  // - For mixed models (e.g., "X5"), only letters count in the sum
  describe("Numbers Only Scenario", () => {
    test("Should return the correct value when model contains only numbers ", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "911", year: 2025 });
      //All characters are numbers, SUM = 0, Value should be 2025
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ suggestedValue: "2025" });
    });
    test("Should correctly handle model with mix of numbers and letters", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "X5", year: 2023 });
      // X=24, 5 should be ignored, SUM =24
      // 24*100 + 2023 = 4423
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ suggestedValue: "4423" });
    });
  });

  //* ================================
  //* ==    Ignore Space & Signs    ==
  //* ================================
  // test("Should ignore spaces in model when calculating value", async () => {
  //   const res = await request(app)
  //     .post("/route1")
  //     .send({ model: "Grand Cherokee", year: 2018 });
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toEqual({ suggestedValue: "13,418" });
  // });

  //! ========================
  //! ==    Negative Year   ==
  //! ========================
  // test("Should return an Error Message- Negative year input", async () => {
  //   const res = await request(app)
  //     .post("/route1")
  //     .send({ model: "Hilux", year: -2018 });
  //   // Valid model, but negative number
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body).toHaveProperty("error");
  // });

  //! ========================
  //! ==   Wrong Data Type  ==
  //! ========================
  // test("Should return an ERROR if wrong data type input", async () => {
  //   const res = await request(app)
  //     .post("/route1")
  //     .send({ model: "X5", year: "Twenty Twenty" });
  //   // Invalid model & year data types
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body).toHaveProperty("error");
  // });

  //TODO ========================
  //TODO ==     Edge Cases     ==
  //TODO ========================
  // test("Should return an ERROR if model is empty string", async () => {
  //   const res = await request(app)
  //     .post("/route1")
  //     .send({ model: "", year: 1996 });
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body).toHaveProperty("error");
  // });

  // test("Should return an ERROR if Year is empty", async () => {
  //   const res = await request(app).post("/route1").send({ model: "Civic" }); // Year is not included
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body).toHaveProperty("error");
  // });
});
