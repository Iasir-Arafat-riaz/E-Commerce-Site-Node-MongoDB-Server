const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { json } = require("express");
const app = express();

//adding middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Ema-jhonDB");
    const allProducts = database.collection("products");
    const orders = database.collection("orders");
    // query for movies that have a runtime less than 15 minutes
    const query = {};
    app.get("/shop", async (req, res) => {
      console.log(req.query);
      const query = {};
      const cursor = allProducts.find(query);
      const pageNumber = req.query.page;
      const size = parseInt(req.query.size);
      
      
      const count = await cursor.count()
      let products;
      if (pageNumber) {
        products = await cursor
          .skip(pageNumber * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send({ products, count });
    });

    //Post operation
     app.post("/shop/keys",async(req,res)=>{
      //  console.log(req.body)
      const keys = req.body;
      const query = {key:{$in:keys}}
      const cursor = allProducts.find(query)
      const products = await cursor.toArray()
       res.send(JSON.stringify(products))
     })

//order post

app.post("/order",async(req,res)=>{
 const query = req.body;
 const order = await orders.insertOne(query)
  res.json(order)
  
})

app.get("/order",async(req,res)=>{
  const email = req.query.email
  let query = {}
  if(email){
    query={email:email}
  }
  const cursor = orders.find(query)
  const result = await cursor.toArray()
  res.json(result)
  // res.send("kichu")
})

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("yes sending connected yaya");
});

app.listen(port, () => {
  console.log("lestening to this port", port);
});
