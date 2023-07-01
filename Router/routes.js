const express = require("express");
const db = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello world");
});

// ### DATA MANAGEMENT ###

// ### M-CUSTOMERS ###
router.get("/management/customers/all", (req, res) => {
  db.query("SELECT * FROM customers", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

router.get("/management/customers/certain/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM customers WHERE CustomerId = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result.rows);
      }
    }
  );
});

router.post("/management/customers/add", (req, res) => {
  const { name, uuid, dob, type } = req.body;
  // created_at, last_modified, is_active are automatically generated by the database
  db.query(
    "INSERT INTO customers (CustomerName, CustomerUuid, DateOfBirth, EncryptionType) VALUES ($1, $2, $3, $4)",
    [name, uuid, dob, type],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("customer added successfully");
      }
    }
  );
});

router.put("/management/customers/update/:id", (req, res) => {
  const id = req.params.id;
  const { name, uuid, dob, balance, type  } = req.body;
  db.query(
    "UPDATE customers SET CustomerName = $1, CustomerUuid = $2, DateOfBirth = $3, Balance = $4, EncryptionType = $5 WHERE CustomerId = $6",
    [name, uuid, dob, balance, type, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("customer updated successfully");
      }
    }
  );
});

router.delete("/management/customers/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM customers WHERE CustomerId = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send("customer deleted successfully");
    }
  });
});

// ### M-SPOTS ###
router.get("/management/spots/all", (req, res) => {
  db.query("SELECT * FROM spots", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

router.get("/management/spots/certain/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM spots WHERE SpotId = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

router.post("/management/spots/add", (req, res) => {
  const { name, uuid, price } = req.body;
  // created_at, last_modified, is_active are automatically generated by the database
  db.query(
    "INSERT INTO spots (SpotName, SpotUuid, Price) VALUES ($1, $2, $3)",
    [name, uuid, price],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("spot added successfully");
      }
    }
  );
});

router.put("/management/spots/update/:id", (req, res) => {
  const id = req.params.id;
  const { name, uuid, price } = req.body;
  db.query(
    "UPDATE spots SET SpotName = $1, SpotUuid = $2, Price = $3 WHERE SpotId = $4",
    [name, uuid, price, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("spot updated successfully");
      }
    }
  );
});

router.delete("/management/spots/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM spots WHERE SpotId = $1", [id], (err, result) => {
    if (err) {  
      console.log(err);
    } else {
      res.status(200).send("spot deleted successfully");
    }
  });
});

// ### ACTIVATION ###
router.put("/activation/customer/:id", (req, res) => {
  const id = req.params.id;
  const { is_active } = req.body;
  db.query(
    "UPDATE customers SET IsActive = $1 WHERE CustomerId = $2",
    [is_active, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("customer activation updated successfully");
      }
    }
  );
});

router.put("/activation/spot/:id", (req, res) => {
  const id = req.params.id;
  const { is_active } = req.body;
  db.query(
    "UPDATE spots SET IsActive = $1 WHERE SpotId = $2",
    [is_active, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("spot activation updated successfully");
      }
    }
  );
});

// Check Activation of Customer
router.get("/activation/customer/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT IsActive FROM customers WHERE CustomerId = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result.rows);
      }
    }
  );
});

// ### DEPOSITS ###
router.get("/deposits/all", (req, res) => {
  db.query("SELECT * FROM deposits", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

// A deposit is made by a customer
router.post("/deposits/add", (req, res) => {
  const { customer_id, amount } = req.body;
  console.log(customer_id, amount);
  // DepositTimestamp is automatically generated by the database
  // insert data to deposits table and update balance in customers table
  db.query(
    "INSERT INTO deposits (CustomerId, Amount) VALUES ($1, $2)",
    [customer_id, amount],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // update balance in customers table
        db.query(
          "UPDATE customers SET Balance = Balance + $1 WHERE CustomerId = $2",
          [amount, customer_id],
          (err, result) => {
            if (err) {
              console.log(err);
              // if error occurs, delete the last deposit was made
              let lastDepositDeleted = false;
              do {
                db.query(
                  "DELETE FROM deposits WHERE DepositId = (SELECT MAX(DepositId) FROM deposits)",
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      lastDepositDeleted = true;
                    }
                  }
                );
              }
              while (!lastDepositDeleted);
            } else {
              res.status(200).send("deposit added successfully");
            }
          }
        );
      }
    }
  );
});

// ### PAYMENTS ###
// A payment is made by a customer in a spot
router.post("/payments/add", (req, res) => {
  const { customer_id, spot_id } = req.body;
  // PaymentTimestamp is automatically generated by the database
  // insert data to payments table and update balance in customers table, balance update is subtracting old balance with price of the spot
  db.query(
    "INSERT INTO payments (CustomerId, SpotId) VALUES ($1, $2)",
    [customer_id, spot_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // update balance in customers table
        db.query(
          "UPDATE customers SET Balance = Balance - (SELECT Price FROM spots WHERE SpotId = $1) WHERE CustomerId = $2",
          [spot_id, customer_id],
          (err, result) => {
            if (err) {
              console.log(err);
              // if error occurs, delete the last payment was made
              let lastPaymentDeleted = false;
              do {
                db.query(
                  "DELETE FROM payments WHERE PaymentId = (SELECT MAX(PaymentId) FROM payments)",
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      lastPaymentDeleted = true;
                    }
                  }
                );
              }
              while (!lastPaymentDeleted);
            } else {
              res.status(200).send("payment added successfully");
            }
          }
        );
      }
    }
  );
});



module.exports = router;
