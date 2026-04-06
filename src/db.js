"use strict";

class Database {
  constructor() {
    this.reset();
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
