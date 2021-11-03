const { MongoClient } = require('mongodb');
const express = require("express")
require("dotenv").config();
const cors = require("cors")
const app = express()

//adding middleware
app.use(cors())
app.use(express.json())
const port = process.env.PORT||5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("Ema-jhonDB");
      const allProducts = database.collection("products");
      // query for movies that have a runtime less than 15 minutes
      const query = {};
      app.get("/shop",async(req,res)=>{
        const query = {}
        const cursor = allProducts.find(query)  
        const all = await cursor.toArray()
        res.send(all)
      })
     
     //Post operation
    //  app.post("shop",async(req,res)=>{
    //    res.send("new one")
    //  })

     
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("yes sending connected yaya")
})

app.listen(port,()=>{
    console.log("lestening to this port",port)
})