const express = require('express');
const bodyParser= require('body-parser')
const MongoClient1 = require('mongodb').MongoClient
var dbcon;
var model;
var ObjectId = require('mongodb').ObjectID;
const app = express();
connect()
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.listen(3000, function() {
    console.log('listening on 3000')
  })

app.get('/', (req, res) => {
  const getData = dbcon.collection('Model').find().toArray()
  .then(results => {
    console.log(results)
    var resdata=results
    res.render('index.ejs',{ resdata: resdata })
  })
  .catch(error => console.error(error))
})

app.post('/create',(req,res) => {
    model.insertOne(req.body).then(result => {
      console.log(result)
      if(result["acknowledged"]==true){
        res.redirect('/')
      }
    })
    .catch(error => console.error(error))
})

app.post('/update',(req,res) => {
  console.log(req.body.id)
  console.log(req.body.name2)
  console.log(req.body.message2)
  model.updateOne(
    { "_id": new ObjectId(req.body.id) },
    {
      $set: {
        //"_id": req.body.id,
        "name": req.body.name2,
        "message": req.body.message2
      }
    }
  )
    .then(result => {
      console.log(result)
      if(result.modifiedCount!=0){
        res.redirect('/')
      }
    })
    .catch(error => console.error(error))
})

app.post('/delete',(req,res) => {
  console.log(req.body.deleteid)
  model.deleteOne(
    {"_id": new ObjectId(req.body.deleteid) }
  ).then(result => {
    console.log(result)
    if(result.deletedCount!=0){
      res.redirect('/')
    }
  })
  .catch(error => console.error(error))
})

async function connect(){
  MongoClient1.connect("mongodb+srv://admin:admin@cluster0.qjyhj.mongodb.net/crud-db-mongonodeexpress?retryWrites=true&w=majority", (err, client) => {
  if (err) return console.error(err)
  console.log("Connected to Database")
  dbcon = client.db("crud-db-mongonodeexpress")
  model = dbcon.collection('Model')
})

}