"use strict";
const express = require("express");
const { BookService, MemberService, LoanService, ValidationError } = require("./services");

function createApp() {
  const app = express();
  app.use(express.json());
  const path = require("path");
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.post("/books", (req, res, next) => {
    try {
      const book = BookService.create(req.body);
      res.status(201).json(book);
    } catch (e) { next(e); }
  });

  app.get("/books", (req, res) => {
    const { q } = req.query;
    res.json(q ? BookService.search(q) : BookService.listAll());
  });

  app.post("/members", (req, res, next) => {
    try {
      const member = MemberService.register(req.body);
      res.status(201).json(member);
    } catch (e) { next(e); }
  });

  app.post("/loans", (req, res, next) => {
    try {
      const loan = LoanService.borrow(req.body);
      res.status(201).json(loan);
    } catch (e) { next(e); }
  });

  app.post("/loans/:id/return", (req, res, next) => {
    try {
      const loan = LoanService.returnBook(parseInt(req.params.id, 10));
      res.json(loan);
    } catch (e) { next(e); }
  });

  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = createApp;
