"use strict";
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "data.json");

class Database {
  constructor() {
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const data = JSON.parse(raw);
        this.books = data.books || [];
        this.members = data.members || [];
        this.loans = data.loans || [];
        this.nextBookId = data.nextBookId || 1;
        this.nextMemberId = data.nextMemberId || 1;
        this.nextLoanId = data.nextLoanId || 1;
        return;
      } catch (e) {}
    }
    this.reset();
  }

  save() {
    if (process.env.NODE_ENV === "test") return;
    const data = {
      books: this.books,
      members: this.members,
      loans: this.loans,
      nextBookId: this.nextBookId,
      nextMemberId: this.nextMemberId,
      nextLoanId: this.nextLoanId,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }

  reset() {
    this.books = [];
    this.members = [];
    this.loans = [];
    this.nextBookId = 1;
    this.nextMemberId = 1;
    this.nextLoanId = 1;
  }
}

module.exports = new Database();
