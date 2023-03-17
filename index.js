const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t6zznhm.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
    const productsCollection = client.db('amazhon').collection('products')

    app.get('/allProducts', async(req, res) => {
      const query = {}
      const cursor = productsCollection.find(query)
      const products = await cursor.toArray()
      res.send(products)
    })

    app.get('/products', async(req, res) => {
      const query = {}
      const cursor = productsCollection.find(query)
      const products = await cursor.limit(15).toArray()
      res.send(products)
    })

    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const product = await productsCollection.findOne(query)
      res.send(product)
    })

    app.get('/category/:id', async (req, res) => {
      const id = req.params.id;
      const query = { category_id: id };
      const productsCategory = await productsCollection.find(query).toArray();
      res.send(productsCategory);
    });

  }
  finally{}
}

run().catch(error => console.error(error))

const menuItems = require("./data/menuItems.json");
app.get("/menuitems", (req, res) => {
  res.send(menuItems);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

