"use strict";
const request = require("supertest");
const createApp = require("../src/app");
const db = require("../src/db");

let app;
beforeEach(() => {
  db.reset();
  app = createApp();
});

describe("API integration", () => {
  test("GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("POST /books then GET /books", async () => {
    const create = await request(app).post("/books").send({
      isbn: "9783161484100", title: "Clean Code",
      author: "Robert Martin", year: 2008, stock: 3,
    });
    expect(create.status).toBe(201);
    const list = await request(app).get("/books");
    expect(list.body.length).toBe(1);
    expect(list.body[0].title).toBe("Clean Code");
  });

  test("POST /books validation error", async () => {
    const res = await request(app).post("/books").send({
      isbn: "bad", title: "x", author: "Author Name", year: 2020,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("full borrow-return flow", async () => {
    await request(app).post("/books").send({
      isbn: "9783161484100", title: "Book",
      author: "Author Name", year: 2020, stock: 1,
    });
    await request(app).post("/members").send({ name: "Ali Rahman", email: "ali@mail.com" });

    const borrow = await request(app).post("/loans").send({ memberId: 1, bookId: 1 });
    expect(borrow.status).toBe(201);
    const loanId = borrow.body.id;

    const afterBorrow = await request(app).get("/books");
    expect(afterBorrow.body[0].stock).toBe(0);

    const ret = await request(app).post(`/loans/${loanId}/return`);
    expect(ret.status).toBe(200);
    expect(ret.body.returnedAt).not.toBeNull();

    const afterReturn = await request(app).get("/books");
    expect(afterReturn.body[0].stock).toBe(1);
  });

  test("borrow nonexistent book", async () => {
    await request(app).post("/members").send({ name: "Ali Rahman", email: "ali@mail.com" });
    const res = await request(app).post("/loans").send({ memberId: 1, bookId: 999 });
    expect(res.status).toBe(400);
    expect(res.body.error.toLowerCase()).toContain("not found");
  });

  test("search books endpoint", async () => {
    await request(app).post("/books").send({
      isbn: "1111111111", title: "Python Testing",
      author: "Someone Here", year: 2020,
    });
    await request(app).post("/books").send({
      isbn: "2222222222", title: "Java Basics",
      author: "Other Author", year: 2019,
    });
    const res = await request(app).get("/books?q=python");
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toContain("Python");
  });
});
