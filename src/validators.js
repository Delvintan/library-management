"use strict";

function validateIsbn(isbn) {
  if (typeof isbn !== "string") return false;
  const cleaned = isbn.replace(/-/g, "").replace(/ /g, "");
  if (!/^\d+$/.test(cleaned)) return false;
  return cleaned.length === 10 || cleaned.length === 13;
}

function validateEmail(email) {
  if (typeof email !== "string" || !email) return false;
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

function validateName(name) {
  if (typeof name !== "string") return false;
  const s = name.trim();
  if (s.length < 2 || s.length > 100) return false;
  return /^[A-Za-z\s]+$/.test(s);
}

function validateYear(year) {
  if (typeof year !== "number" || !Number.isInteger(year)) return false;
  const current = new Date().getFullYear();
  return year >= 1800 && year <= current;
}

function calculateLateFee(daysLate, ratePerDay = 1000) {
  if (typeof daysLate !== "number" || !Number.isInteger(daysLate)) {
    throw new TypeError("daysLate must be integer");
  }
  if (daysLate <= 0) return 0;
  return daysLate * ratePerDay;
}

module.exports = {
  validateIsbn,
  validateEmail,
  validateName,
  validateYear,
  calculateLateFee,
};
