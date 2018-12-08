const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const connect = require('./src/connect.js');
const Mclient = require('mongodb').MongoClient;

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/modes',function(req,res) {
  Mclient.connect(connect.mongo.url,function(error,client) {
    if(error)throw error;
    let database = client.db('rp');

    database.collection('app_data').find({title: "modes"}).toArray(function(error,data) {
      if(error)throw error;
      res.send({modes : data[0].data});
    })
  })
})

app.post('/login',function(req,res,next) {
  console.log(req.body);
  Mclient.connect(connect.mongo.url,function(error,client) {
    if(error)throw error;
    let database = client.db('rp');

    database.collection('user_data').find({username : req.body.username}).toArray(function(error,data) {
      console.log(data)
      if(data == '') {
        res.send({error: 'User not found'})
      }
      else if(data[0].password != req.body.password){
        res.send({error: 'Incorrect Password'})
      }
      else {
        res.send({loggedIn : true})
      }
    })
  })
})

app.post('/updateMode',function(req,res,next) {

  Mclient.connect(connect.mongo.url,function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    database.collection('user_data').updateOne({title : 'currentMode'},{data : req.body.mode});
  })
})
app.listen(process.env.PORT || 5000);
