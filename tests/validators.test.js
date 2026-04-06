"use strict";
const {
  validateIsbn, validateEmail, validateName, validateYear, calculateLateFee,
} = require("../src/validators");

describe("validateIsbn", () => {
  test("valid ISBN-10", () => expect(validateIsbn("0306406152")).toBe(true));
  test("valid ISBN-13 with dashes", () => expect(validateIsbn("978-3-16-148410-0")).toBe(true));
  test("invalid length", () => expect(validateIsbn("12345")).toBe(false));
  test("non-digit", () => expect(validateIsbn("ABCDEFGHIJ")).toBe(false));
  test("non-string", () => expect(validateIsbn(1234567890)).toBe(false));
});

describe("validateEmail", () => {
  test("valid", () => expect(validateEmail("user@example.com")).toBe(true));
  test("no @", () => expect(validateEmail("userexample.com")).toBe(false));
  test("empty", () => expect(validateEmail("")).toBe(false));
});

describe("validateName", () => {
  test("valid", () => expect(validateName("Budi Santoso")).toBe(true));
  test("too short", () => expect(validateName("A")).toBe(false));
  test("with numbers", () => expect(validateName("Budi123")).toBe(false));
});

describe("validateYear", () => {
  test("valid", () => expect(validateYear(2020)).toBe(true));
  test("too old", () => expect(validateYear(1700)).toBe(false));
  test("not int", () => expect(validateYear("2020")).toBe(false));
});

describe("calculateLateFee", () => {
  test("zero days", () => expect(calculateLateFee(0)).toBe(0));
  test("negative", () => expect(calculateLateFee(-3)).toBe(0));
  test("positive", () => expect(calculateLateFee(5)).toBe(5000));
  test("custom rate", () => expect(calculateLateFee(4, 2000)).toBe(8000));
  test("type error", () => expect(() => calculateLateFee("5")).toThrow(TypeError));
});
