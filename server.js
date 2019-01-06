const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const connect = require('./src/connect.js');
const Mclient = require('mongodb').MongoClient;

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/mode',function(req,res,next){
  Mclient.connect(connect.mongo.url,function(error,client){
    if(error)throw error;

    let database = client.db('rp');

    database.collection('app_data').find({title : 'currentMode'}).toArray(function(error,data) {
      if(error) throw error;
      res.send({mode : data[0].data});
    })
  })
})

app.get('/getUsers',function(req,res,next) {
  Mclient.connect(connect.mongo.url,function(error,client){
    if(error)throw error;

    let database = client.db('rp');

    database.collection('user_data').find({title : 'users'}).toArray(function(error,data) {
      if(error)throw error;

      res.send({data : data[0].data})
    })
  })
})

app.post('/login',function(req,res,next) {
  Mclient.connect(connect.mongo.url,function(error,client) {
    if(error)throw error;
    let database = client.db('rp');

    database.collection('user_data').find({username : req.body.username}).toArray(function(error,data) {
      if(data == '') {
        res.send({error: 'User not found'})
      }
      else if(data[0].password != req.body.password){
        res.send({error: 'Incorrect Password'})
      }
      else {
        if(data[0].username == "QueenRajj") {
          return res.send({loggedIn : true,user_type : 'admin'})
        }
        else {
          return res.send({loggedIn : true,user_type : 'host'})
        }
      }
    })
  })
})

app.post('/updateMode',function(req,res,next) {
  Mclient.connect(connect.mongo.url,function(error,client) {
    if(error)throw error;

    let database = client.db('rp');
    try {
      database.collection('app_data').update({title : 'currentMode'},{"data" : req.body.modeChoice});
    }
    catch(error) {
      console.log('database could not be updated : ' + error)
    }
  })
})

app.post('/roomCode',function(req,res,next) {
  let code = req.body.code

  Mclient.connect(connect.mongo.url,function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    //compare entered code to database code
    database.collection('app_data').find({title : 'accessCode'}).toArray(function(error,data) {
      if(data[0].data != code) {
        res.send({error: 'Wrong code',success : false})
      }
      else {
        //redirect to lobby and establish connection;
        res.send({success : true,user_type : 'guest'});
      }
    })
  })
})

app.post('/createCode',function(req,res,next) {
  let code = req.body.code;

  //update database roomcode
  Mclient.connect(connect.mongo.url,function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    database.collection('app_data').update({title: 'accessCode'},{$set : {data : code}});
  })
})
app.listen(process.env.PORT || 5000);
