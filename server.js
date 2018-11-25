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
    })
  })
})
app.listen(process.env.PORT || 5000);
