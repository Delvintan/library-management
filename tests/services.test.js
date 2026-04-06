"use strict";
const db = require("../src/db");
const {
  BookService, MemberService, LoanService, ValidationError,
} = require("../src/services");

beforeEach(() => db.reset());

describe("BookService", () => {
  test("create book success", () => {
    const b = BookService.create({
      isbn: "9783161484100", title: "Clean Code",
      author: "Robert Martin", year: 2008, stock: 2,
    });
    expect(b.id).toBeDefined();
    expect(b.stock).toBe(2);
  });

  test("create book invalid ISBN", () => {
    expect(() => BookService.create({
      isbn: "bad", title: "T", author: "Author Name", year: 2020,
    })).toThrow(ValidationError);
  });

  test("create book duplicate ISBN", () => {
    BookService.create({ isbn: "9783161484100", title: "A", author: "Author One", year: 2020 });
    expect(() => BookService.create({
      isbn: "9783161484100", title: "B", author: "Author Two", year: 2021,
    })).toThrow(/already exists/);
  });

  test("search books", () => {
    BookService.create({ isbn: "1111111111", title: "Python Testing", author: "Someone Here", year: 2020 });
    BookService.create({ isbn: "2222222222", title: "Java Basics", author: "Other Author", year: 2019 });
    expect(BookService.search("python").length).toBe(1);
  });
});

describe("MemberService", () => {
  test("register success", () => {
    const m = MemberService.register({ name: "Siti Aminah", email: "siti@mail.com" });
    expect(m.id).toBeDefined();
  });

  test("register invalid email", () => {
    expect(() => MemberService.register({
      name: "Siti", email: "not-an-email",
    })).toThrow(ValidationError);
  });
});

describe("LoanService", () => {
  test("borrow success", () => {
    const b = BookService.create({ isbn: "9783161484100", title: "Book", author: "Author Name", year: 2020, stock: 1 });
    const m = MemberService.register({ name: "Ali Rahman", email: "ali@mail.com" });
    const loan = LoanService.borrow({ memberId: m.id, bookId: b.id });
    expect(loan.id).toBeDefined();
    expect(b.stock).toBe(0);
  });

  test("borrow out of stock", () => {
    const b = BookService.create({ isbn: "9783161484100", title: "Book", author: "Author Name", year: 2020, stock: 0 });
    const m = MemberService.register({ name: "Ali Rahman", email: "ali@mail.com" });
    expect(() => LoanService.borrow({ memberId: m.id, bookId: b.id })).toThrow(/out of stock/);
  });

  test("borrow max loans", () => {
    const m = MemberService.register({ name: "Ali Rahman", email: "ali@mail.com" });
    const isbns = ["1111111111", "2222222222", "3333333333", "4444444444"];
    isbns.forEach((isbn, i) => {
      const b = BookService.create({ isbn, title: `B${i}`, author: "Author Name", year: 2020, stock: 1 });
      if (i < 3) {
        LoanService.borrow({ memberId: m.id, bookId: b.id });
      } else {
        expect(() => LoanService.borrow({ memberId: m.id, bookId: b.id })).toThrow(/max/);
      }
    });
  });

  test("return book success", () => {
    const b = BookService.create({ isbn: "9783161484100", title: "Book", author: "Author Name", year: 2020, stock: 1 });
    const m = MemberService.register({ name: "Ali Rahman", email: "ali@mail.com" });
    const loan = LoanService.borrow({ memberId: m.id, bookId: b.id });
    const ret = LoanService.returnBook(loan.id);
    expect(ret.returnedAt).not.toBeNull();
    expect(b.stock).toBe(1);
  });

  test("return already returned", () => {
    const b = BookService.create({ isbn: "9783161484100", title: "Book", author: "Author Name", year: 2020, stock: 1 });
    const m = MemberService.register({ name: "Ali Rahman", email: "ali@mail.com" });
    const loan = LoanService.borrow({ memberId: m.id, bookId: b.id });
    LoanService.returnBook(loan.id);
    expect(() => LoanService.returnBook(loan.id)).toThrow(/already returned/);
  });
});
