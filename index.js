const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

// technologyBrand
//zKv7ftpuWBevbhJU

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgwhtfa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const productCollection = client.db("productDB").collection("products");
    const userCollection = client.db("productDB").collection("user");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:brandName", async (req, res) => {
      const cursor = productCollection.find({
        brandName: req.params.brandName,
      });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:brandName/:id", async (req, res) => {
      const id = req.params.id;
      const brand = req.params.brandName;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query, brand);
      res.send(result);
    });

    app.get("/products/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const brand = req.params.brandName;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query, brand);
      res.send(result);
    });

    app.put("/products/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          brandName: user.brandName,
          type: user.type,
          price: user.price,
          rating: user.rating,
          image: user.image,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedUser,
        options
      );
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //USER RELATED API
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const user = await cursor.toArray();
      res.send(user);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Technology Brand server is running");
});
app.listen(port, () => {
  console.log(`Technology Brand is running on port: ${port}`);
});
