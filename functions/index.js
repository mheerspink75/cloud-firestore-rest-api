const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://node-test-10132.firebaseio.com",
});
const db = admin.firestore();

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: true }));


// Routes
app.get("/test-path", (req, res) => {
  return res.status(200).send("Hello World");
});

// Create - POST
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db
        .collection("products")
        .doc("/" + req.body.id + "/")
        .create({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
        });
      return res.status.apply(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read - GET product by ID
app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      let product = await document.get();
      let response = product.data();
      console.log(response);
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read - GET all products
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      let query = db.collection("products");
      let response = [];
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs; // query result
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
          };
          response.push(selectedItem);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Update - PUT updated product
app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      await document.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Delete - DELETE product
app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);
