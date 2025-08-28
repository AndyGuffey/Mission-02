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
    test("Should return correct value when model contains only numbers: (911,2025) Value: 2025", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "911", year: 2025 });
      //All characters are numbers, SUM = 0, Value should be 2025
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ suggestedValue: "2025" });
    });
    test("Should correctly handle model with mix of numbers and letters: (X5, 2023) Value: 4423", async () => {
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
  // - Spaces in model names should be ignored (e.g., "Grand Cherokee")
  // - Special characters and symbols should be ignored (e.g., "F@St $PEEDY BO!")
  // - Only letters contribute to the value calculation
  // - For example: "Grand Cherokee" -> G=7, R=18, A=1, etc. (spaces ignored)

  describe("Ignore Space & Signs Scenario", () => {
    test("Should ignore spaces in model when calculating value: (Grand Cherokee, 2018) Value: $13,418", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "Grand Cherokee", year: 2018 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ suggestedValue: "13418" });
    });

    test("Should Ignore special characters when calculating value: (F@St BO!, 1946) Value: $8,146", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "F@St BO!", year: 1946 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ suggestedValue: "8146" });
    });
  });

  //! ========================
  //! ==    Negative Year   ==
  //! ========================
  // - If a negative year is provided (e.g., -2018), the API should return a 400 error
  // - Validation should occur before any calculation is attempted
  // - A descriptive error message should be included in the response
  describe("Negative Year Scenario", () => {
    test("Should return an Error Message- Year must be a positive number: (Hilux, -2018)", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "Hilux", year: -2018 });
      // Valid model, but negative number
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  //! ========================
  //! ==   Wrong Data Type  ==
  //! ========================
  describe("Wrong Data Type Scenario", () => {
    test("Should return an ERROR if year is wrong data type: (Hilux, 'Twenty Twenty')", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: "Hilux", year: "Twenty Twenty" });
      // Valid model &  wrong year data types
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
    test(" Should return an ERROR if model is not a string:(1996, 2020)", async () => {
      const res = await request(app)
        .post("/route1")
        .send({ model: 1996, year: 2020 });
      // Invalid model data type
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  //TODO ========================
  //TODO ==     Edge Cases     ==
  //TODO ========================
  // describe("Edge Case Scenarios", () => {
  //   test("Should return an ERROR if model is empty string", async () => {
  //     const res = await request(app)
  //       .post("/route1")
  //       .send({ model: "", year: 1996 });
  //     expect(res.statusCode).toBe(400);
  //     expect(res.body).toHaveProperty("error");
  //   });

  //   test("Should return an ERROR if Year is empty", async () => {
  //     const res = await request(app).post("/route1").send({ model: "Civic" }); // Year is not included
  //     expect(res.statusCode).toBe(400);
  //     expect(res.body).toHaveProperty("error");
  //   });
  // });
});
