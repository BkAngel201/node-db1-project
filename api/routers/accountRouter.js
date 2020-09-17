const express = require("express");

const router = express.Router();
const db = require("../../data/dbConfig");

router.get("/", async (req, res) => {
  const query = req.query;
  try {
    let account = [];
    if (query.limit && query.sortby && query.sortdir) {
      accounts = await db("accounts")
        .orderBy(query.sortby, query.sortdir)
        .limit(query.limit);
    } else {
      accounts = await db("accounts");
    }

    res.status(200).json(accounts);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "Error handling data info", error: err });
  }
});

router.get("/:id", verifyAccountID, async (req, res) => {
  const { id } = req.params;
  try {
    const account = await db("accounts").where({ id: id });
    res.status(200).json(account);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "Error handling data info", error: err });
  }
});

router.delete("/:id", verifyAccountID, async (req, res) => {
  const { id } = req.params;

  try {
    const account = await db("accounts").where({ id: id }).del();
    res.status(200).json(account);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "Error handling data info", error: err });
  }
});

router.post("/", verifyBody, async (req, res) => {
  const body = req.body;
  try {
    const account = await db("accounts").insert(body);
    res.status(201).json(account);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "Error handling data info", error: err });
  }
});

router.put("/:id", verifyBody, verifyAccountID, async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const account = await db("accounts").where({ id: id }).update(body);
    res.status(200).json(account);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "Error handling data info", error: err });
  }
});

// Middleware Functions

function verifyBody(req, res, next) {
  const body = req.body;
  if (!body || body === {}) {
    res.status(400).json({ message: "Missing Account data" });
  } else {
    if (body.name && body.budget) {
      next();
    } else {
      res
        .status(400)
        .json({ message: "Missing required Name or Budget field" });
    }
  }
}

async function verifyAccountID(req, res, next) {
  const { id } = req.params;

  try {
    const account = await db("accounts").where({ id: id });
    if (account.length === 0) {
      res
        .status(400)
        .json({ message: "The account with that ID do not exist in the DB" });
    } else {
      next();
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "Error handling data info", error: err });
  }
}

module.exports = router;
