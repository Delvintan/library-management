"use strict";
const db = require("./db");
const {
  validateIsbn, validateEmail, validateName, validateYear,
} = require("./validators");

const MAX_ACTIVE_LOANS = 3;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

const BookService = {
  create({ isbn, title, author, year, stock = 1 }) {
    if (!validateIsbn(isbn)) throw new ValidationError("Invalid ISBN");
    if (!title || typeof title !== "string") throw new ValidationError("Title required");
    if (!validateName(author)) throw new ValidationError("Invalid author name");
    if (!validateYear(year)) throw new ValidationError("Invalid year");
    if (!Number.isInteger(stock) || stock < 0) throw new ValidationError("Invalid stock");
    if (db.books.find((b) => b.isbn === isbn)) {
      throw new ValidationError("ISBN already exists");
    }
    const book = { id: db.nextBookId++, isbn, title, author, year, stock };
    db.books.push(book);
    db.save();
    return book;
  },
  listAll() {
    return db.books;
  },
  search(keyword) {
    if (!keyword) return [];
    const k = keyword.toLowerCase();
    return db.books.filter(
      (b) => b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k)
    );
  },
  findById(id) {
    return db.books.find((b) => b.id === id);
  },
};

const MemberService = {
  register({ name, email }) {
    if (!validateName(name)) throw new ValidationError("Invalid name");
    if (!validateEmail(email)) throw new ValidationError("Invalid email");
    if (db.members.find((m) => m.email === email)) {
      throw new ValidationError("Email already registered");
    }
    const member = { id: db.nextMemberId++, name: name.trim(), email };
    db.members.push(member);
    db.save();
    return member;
  },
  findById(id) {
    return db.members.find((m) => m.id === id);
  },
  activeLoanCount(memberId) {
    return db.loans.filter((l) => l.memberId === memberId && l.returnedAt === null).length;
  },
};

const LoanService = {
  borrow({ memberId, bookId }) {
    const member = MemberService.findById(memberId);
    if (!member) throw new ValidationError("Member not found");
    const book = BookService.findById(bookId);
    if (!book) throw new ValidationError("Book not found");
    if (book.stock <= 0) throw new ValidationError("Book out of stock");
    if (MemberService.activeLoanCount(memberId) >= MAX_ACTIVE_LOANS) {
      throw new ValidationError(`Member has reached max ${MAX_ACTIVE_LOANS} active loans`);
    }
    const existing = db.loans.find(
      (l) => l.memberId === memberId && l.bookId === bookId && l.returnedAt === null
    );
    if (existing) throw new ValidationError("Member already borrowing this book");
    book.stock -= 1;
    const loan = {
      id: db.nextLoanId++,
      memberId,
      bookId,
      borrowedAt: new Date().toISOString(),
      returnedAt: null,
    };
    db.loans.push(loan);
    db.save();
    return loan;
  },
  returnBook(loanId) {
    const loan = db.loans.find((l) => l.id === loanId);
    if (!loan) throw new ValidationError("Loan not found");
    if (loan.returnedAt !== null) throw new ValidationError("Loan already returned");
    loan.returnedAt = new Date().toISOString();
    const book = BookService.findById(loan.bookId);
    book.stock += 1;
    db.save();
    return loan;
  },
};

module.exports = {
  BookService,
  MemberService,
  LoanService,
  ValidationError,
  MAX_ACTIVE_LOANS,
};
