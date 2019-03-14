const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const connect = require('./src/connect.js');
const Mclient = require('mongodb').MongoClient;

const io = require('socket.io')();
const socketStream = require('socket.io-stream')

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
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;
    let database = client.db('rp');

    database.collection('app_data').find({title: "modes"}).toArray(function(error,data) {
      if(error)throw error;
      res.send({modes : data[0].data});
    })
  })
})

app.get('/mode',function(req,res,next){
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client){
    if(error)throw error;

    let database = client.db('rp');

    database.collection('app_data').find({title : 'currentMode'}).toArray(function(error,data) {
      if(error) throw error;
      res.send({mode : data[0].data});
    })
  })
})

app.get('/getUsers',function(req,res,next) {
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client){
    if(error)throw error;

    let database = client.db('rp');

    database.collection('user_data').find({title : 'users'}).toArray(function(error,data) {
      if(error)throw error;

      res.send({list : data[0].data})
    })
  })
})

app.get('/getPoll',function(req,res,next) {
  let pollCode = req.query.code;

  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    database.collection('app_data').find({title: 'pollData'}).toArray(function(error,data) {
        for(i = 0; i < data[0].data.length; i++) {
          if(data[0].data[i].code == pollCode) {
            let array = Object.keys(data[0].data[i]);
            array = array.splice(0,array.length-1)
            return res.send({pollResult : array})
          }
        }
        return res.send({error : "poll not found"})
    })
  })
})

app.get('/allPolls',function(req,res,next) {
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    let database = client.db('rp');

    database.collection('app_data').find({title : 'pollData'}).toArray(function(error,data) {
      res.send({data : data[0].data})
    })
  })
})
app.post('/login',function(req,res,next) {
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
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
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');
    try {
      database.collection('app_data').updateOne({title : 'currentMode'},{"data" : req.body.modeChoice});
    }
    catch(error) {
      console.log('database could not be updated : ' + error)
    }
  })
})

app.post('/roomCode',function(req,res,next) {
  let code = req.body.code

  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
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
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    database.collection('app_data').updateOne({title: 'accessCode'},{$set : {data : code}});
  })
})

app.post('/addUser',function(req,res,next) {
  let userData = req.body

  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    database.collection('user_data').find({title: 'users'}).toArray(function(error,data) {

      let users = data[0].data
      for(var item in users) {
        if(users[item].username == userData.username) {
          return res.send({error : "user already exists"})
        }
      }

      database.collection('user_data').updateOne({title : 'users'},{$push : {data : userData}})
      return res.send({success : true})
    })
  })
})

app.post('/deleteUser',function(req,res,next) {

  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');
    try {
      database.collection('user_data').updateOne({title : 'users'},{$pull : {data : {username : req.body.username}}})
    }
    catch(error) {
      console.log("ERROR(deleting user) : " + error)
    }
  })
})

app.post('/addVotingPoll',function(req,res,next) {
  var code = Math.random().toString(36).substring(2, 8)
  var pushData = {};
  for(var item in req.body) {
    pushData[req.body[item]] = 0;
  }

  pushData.code = code;

  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    try{
      database.collection('app_data').updateOne({title : 'pollData'},{$push : {data : pushData}});
    }
    catch(error) {
      console.log("ERROR(adding vote poll) : " + error)
    }
  })
})

app.post('/addVote',function(req,res,next) {
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    let database = client.db('rp');
    try {
      database.collection('app_data').updateOne({title: 'pollData',"data.code" : req.body.pollCode},{$inc : {["data.$." + req.body.voteChoice] : 1}})
    }
    catch(error) {
      console.log("Error : " + error)
    }
  })
})

app.post('/deletePoll',function(req,res,next) {
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    let database = client.db('rp')
    try {
      database.collection('app_data').updateOne({title: 'pollData'},{$pull : {data : {code : req.body.pollCode}}})
    }
    catch(error) {
      console.log("Error(deleting poll) : " + error)
    }
  })
})

//---------------------------------------------------------------- sockets --------------------------------------------------------------
io.on('connection',(client) => {
  client.on('webcamConnect',() => {
    console.log("Webcam connected")
  })
})

const port = 5001;
io.listen(port)
console.log('Sockets listening on port : ' + port)
//---------------------------------------------------------------------------------------------------------------------------------------
app.listen(process.env.PORT || 5000);
