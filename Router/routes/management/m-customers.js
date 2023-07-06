const express = require("express");
const router = express.Router();
const db = require("../../../utils/database");

// ### M-CUSTOMERS ###

// ----------------------------------------------------------------------------------------------
// #### GETTER ####

// Get all customers data
router.get("/management/customers/all", (req, res) => {
  db.query("SELECT * FROM customers ORDER BY CustomerId ASC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("[API] all customers data fetched successfully");
      res.status(200).send(result.rows);
    }
  });
});

// Get a certain customer data, by ID
router.get("/management/customers/certain/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM customers WHERE CustomerId = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] a certain customer data fetched successfully");
        res.status(200).send(result.rows);
      }
    }
  );
});

// Get a certain customer data, by UUID
router.get("/management/customers/certain/uuid/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  db.query(
    "SELECT * FROM customers WHERE CustomerUuid = $1",
    [uuid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] a certain customer data fetched successfully");
        res.status(200).send(result.rows);
      }
    }
  );
});

// Get one customer's balance
router.get("/management/customers/balance/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT Balance FROM customers WHERE CustomerId = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] customer's balance fetched successfully");
        res.status(200).send(result.rows);
      }
    }
  );
});

// Check one customer's balance, by UUID
router.get("/management/customers/balance/uuid/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  db.query(
    "SELECT Balance FROM customers WHERE CustomerUuid = $1",
    [uuid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] customer's balance fetched successfully");
        res.status(200).send(result.rows);
      }
    }
  );
});

// Get one customer's active status, by ID
router.get("/management/customers/active/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT IsActive FROM customers WHERE CustomerId = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] customer's active status fetched successfully");
        res.status(200).send(result.rows);
      }
    }
  );
});

// Get one customer's active status, by UUID
router.get("/management/customers/active/uuid/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  db.query(
    "SELECT IsActive FROM customers WHERE CustomerUuid = $1",
    [uuid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] customer's active status fetched successfully");
        res.status(200).send(result.rows);
      }
    }
  );
});

// ----------------------------------------------------------------------------------------------
// #### SETTER ####

// Add a new customer data
router.post("/management/customers/add", (req, res) => {
  const { name, uuid, dob, type, balance } = req.body;
  // created_at, last_modified, is_active are automatically generated by the database
  db.query(
    "INSERT INTO customers (CustomerName, CustomerUuid, DateOfBirth, Balance, EncryptionType) VALUES ($1, $2, $3, $4, $5)",
    [name, uuid, dob, balance, type],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] customer added successfully");
        res.status(200).send("customer added successfully");
      }
    }
  );
});

// Update A Customer data
router.patch("/management/customers/update/:id", (req, res) => {
  const id = req.params.id;
  const { name, uuid, dob, balance, type } = req.body;
  db.query(
    "UPDATE customers SET CustomerName = $1, CustomerUuid = $2, DateOfBirth = $3, Balance = $4, EncryptionType = $5 WHERE CustomerId = $6",
    [name, uuid, dob, balance, type, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] customer updated successfully");
        res.status(200).send("customer updated successfully");
      }
    }
  );
});

// Delete A Customer
router.delete("/management/customers/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM customers WHERE CustomerId = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] customer deleted successfully");
        res.status(200).send("customer deleted successfully");
      }
    }
  );
});

module.exports = router;