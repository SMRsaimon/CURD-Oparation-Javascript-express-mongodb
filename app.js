const express = require("express");
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@cluster0.736kg.mongodb.net/store?retryWrites=true&w=majority`;
const uri = "mongodb+srv://SAIMON12:UserPass123@cluster0.736kg.mongodb.net/store?retryWrites=true&w=majority";
const ObjectID = require("mongodb").ObjectID
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const ProductCollection = client.db("store").collection("product");


  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")


  });
  // ADD product
  app.post("/addProducts", (req, res) => {
    const product = req.body
    ProductCollection.insertOne(product)
      .then(result => {

        console.log(result.insertedCount)

        res.redirect("/")

      })

  });

  // send product to clint page 
  app.get("/productDetails", (req, res) => {
    ProductCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })


  });

  // delete product collection

  app.delete('/deleteProduct/:id', (req, res) => {

    ProductCollection.deleteOne({
      _id: ObjectID(req.params.id)
    })
      .then(result => {
        res.send(result.deletedCount > 0)
      })

  })

  // Load single data


  app.get("/product/:id", (req, res) => {
    ProductCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })

  });

  // Update product details
  app.patch("/update/:id", (req, res) => {


    console.log(req.params.id)
    ProductCollection.updateOne({ _id: ObjectID(req.params.id) },
      {
        $set: { price: req.body.price, quintity: req.body.quintity }
      }

    )
      .then(result => {

        res.send(result.modifiedCount > 0)
      })
  })



});



module.exports = app