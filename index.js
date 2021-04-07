const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmexp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("bookStore").collection("books");
  const ordersCollection = client.db("bookStore").collection("orders");

  app.get('/books', (req, res) => {
      booksCollection.find()
      .toArray((err, collection) => {
          res.send(collection)
      })

  })
  app.get('/orders', (req, res) => {
    ordersCollection.find()
    .toArray((err, collection) => {
        res.send(collection)
    })

})

  app.get('/books/:name', (req, res) => {
    booksCollection.find({name: req.params.name})
    .toArray((err, collection) => {
        res.send(collection[0])
    })

})

  app.post('/addBook', (req, res) => {
      const newBook = req.body;
      booksCollection.insertOne(newBook)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })
  
  app.post('/addOrder', (req,res) => {
    const newOrder = req.body;
   ordersCollection.insertOne(newOrder)
   .then(result => {
     res.send(result.insertedCount > 0)
   })

  })

  console.log('database connected successfully')
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)