const express = require("express");
const router = express.Router();
const db = require("../../utils/database");

// ### DATA MANAGEMENT ###

// ### M-CUSTOMERS ###
// Get All Customers data
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

// Get A Certain Customer data
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

// Add A Customer
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

// ### M-SPOTS ###

// Get All Spots data
router.get("/management/spots/all", (req, res) => {
  db.query("SELECT * FROM spots ORDER BY SpotId ASC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("[API] spots data fetched successfully")
      res.status(200).send(result.rows);
    }
  });
});

// Get A Certain Spot data
router.get("/management/spots/certain/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM spots WHERE SpotId = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("[API] spot data fetched successfully")
      res.status(200).send(result.rows);
    }
  });
});

// Add A Spot
router.post("/management/spots/add", (req, res) => {
  const { name, price } = req.body;
  // created_at, last_modified, is_active are automatically generated by the database
  db.query(
    "INSERT INTO spots (SpotName, Price) VALUES ($1, $2)",
    [name, price],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] spot added successfully");
        res.status(200).send("spot added successfully");
      }
    }
  );
});

// Update A Spot data
router.patch("/management/spots/update/:id", (req, res) => {
  const id = req.params.id;
  const { name, price } = req.body;
  db.query(
    "UPDATE spots SET SpotName = $1, Price = $2 WHERE SpotId = $3",
    [name, price, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("[API] spot updated successfully");
        res.status(200).send("spot updated successfully");
      }
    }
  );
});

// Delete A Spot
router.delete("/management/spots/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM spots WHERE SpotId = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("[API] spot deleted successfully");
      res.status(200).send("spot deleted successfully");
    }
  });
});

module.exports = router;