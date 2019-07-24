const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const connect = require('./src/connect.js');
const Mclient = require('mongodb').MongoClient;

const bcrypt = require('bcrypt')

const io = require('socket.io')();
const socketStream = require('socket.io-stream');

//---------------------------------------------------------------- sockets --------------------------------------------------------------
let offers = []
let currentOfferHost = '';
let users = [];
let userPositionCount = -1;
let userPosition = 0;
let contPosition = 5;
let positions = [];
io.on('connection',(client) => {
  userPositionCount += 1;

  connectedClientCount = Object.keys(io.sockets.sockets).length
  clientList = Object.keys(io.sockets.sockets)
  console.log("Connected Clients : " + connectedClientCount)

  //when a new client turns on their webcam
  client.on("newWebcamMounted", () => {
    //ping other connected clients to create new RTC offers, include id of new client so we know where to send the offer once its sent back
    client.broadcast.emit('createNewRTCOffer',client.id);
  })

  //get offers for the newly connected client
  client.on("RTCOfferCreated", (offer) => {
    //save the origin of the offer and forward it to the destination client
    offer.originID = client.id;
    io.to([offer.destinationID]).emit("receiveRTCOffer",offer)
  })

  //forward RTC answer to the offer creator
  client.on("sendRTCAnswer", (answer) => {
    io.to([answer.destinationID]).emit("receiveRTCAnswer",answer)
  })

  //relay the new ICE candidate to other clients
  client.on("newIceCandidate", (candidate,index) => {
    client.broadcast.emit("receiveNewIceCandidate",candidate,index)
  })

  client.on("disconnect", () => {
    io.emit("clientDisconnect",client.id)

    for(var i = 0; i < users.length; i++) {
      if(users[i].socketID == client.id) {

        //change pos variables according to user type
        if(users[i].userType == "host") {
          io.emit("resetSingleVote",users[i].userPosition)
          userPositionCount -= 1;
        }
        else if(users[i].userType == "guest") {
          contPosition -= 1;
        }
        //remove user from array
        users.splice(i,1);
      }
    }

    //userPosition -= 1;
  })

  client.on("linkUserToSocket", (username,userType) => {

    //if username is empty, a contestant/usertype=guest is connecting
    if(username == "") {
      //check if contestants already connected
      var flagContestant1 = false;
      var flagContestant2 = false;
      for(var item in users) {
        if(users[item].username == "contestant1") {
          flagContestant1 = true;
        }

        if(users[item].username == "contestant2") {
          flagContestant2 = true;
        }
      }

      //set username based on flag
      if(flagContestant1 == false) {
        username = "contestant1"
      }
      else if(flagContestant1 == true && flagContestant2 == false) {
        username = "contestant2"
      }
    }

    //check if user is already connected
    let connectedUser = false
    for(var item in users) {
      if(users[item].username == username) {
        connectedUser = true
      }
    }
    //if they arent connected add them to the user array
    if(connectedUser == false) {
      var actualPosition
      var found = false;

      //check if they had been previously connected and already have a position
      for(var item in positions) {
        if(positions[item].username == username) {
          actualPosition = positions[item].position
          found = true;
        }
      }

      //if they hadnt already connected, increment userposition and add data to positions array
      if(found == false) {
        if(userType == "host") {
          userPosition = userPosition + 1;
          actualPosition = userPosition
        }
        else if(userType == "admin"){
          actualPosition = 0;
        }
        else {
          //contestant position starts at cam 5
          actualPosition = contPosition;
          contPosition += 1;
          username = "contestant" + contPosition - 5;
        }
        positions.push({username : username,position : userPosition})
      }

      //add data to user array
      if(userType != "guest") {
        users.push({username : username,socketID : client.id,userCount : userPositionCount,userPosition : actualPosition,userType: userType});
      }
      else {
        users.push({username : ["contestant" + (contPosition - 5)],socketID : client.id,userCount : userPositionCount,userPosition : actualPosition,userType: userType})
      }
      //re-emit all usernames so clients can update their positions on frontend
      let usernames = [];
      for(var item in users) {
        //empty username signifies admin
        if(users[item].username != "contestant1" && users[item].username != "contestant2") {
          usernames.push({position : users[item].userPosition,username : users[item].username})
        }
      }
      io.to([client.id]).emit("receiveUsernames",usernames)

    }
  })

  //set vote state to yes and emit to other clients
  client.on("hostVoteYes", () => {
    for(var i = 0 ; i < users.length; i++) {
      if(users[i].socketID == client.id) {
        io.emit("hostVotedYes",users[i].userPosition);
        users[i].voteState = "yes"
      }
    }
  })

  //set vote state to no and emit to other clients
  client.on("hostVoteNo",() => {
    for(var i = 0 ; i < users.length; i++) {
      if(users[i].socketID == client.id) {
        io.emit("hostVotedNo",users[i].userPosition);
        users[i].voteState = "no"
      }
    }
  })

  //reset a single hosts vote
  client.on("resetHostVote", () => {
    for(var i = 0 ; i < users.length; i++) {
      if(users[i].socketID == client.id) {
        io.emit("resetSingleVote",users[i].userPosition);
        users[i].voteState = "none"
      }
    }
  })

  //admin reset vote states for all users
  client.on("resetAllVotes",() => {
    io.emit("resetAllVote");
    for(var i = 0 ; i < users.length; i++) {
      users[i].voteState = "none";
    }
  })

  //emit existing user voting states for new connecting clients
  client.on("getUserVoteStates",() => {
    let voteStates= [];
    for(var i = 0; i < users.length; i++) {
      if(users[i].userType != "guest") {
        voteStates.push(users[i].voteState)
      }
    }

    io.to([client.id]).emit("receiveUserVoteStates",voteStates)
  })

  //send frontend position
  client.on("getPersonalPosition",() => {
    for(var i = 0 ; i < users.length; i++) {
      if(users[i].socketID == client.id) {
        io.to([client.id]).emit("receivePersonalPosition",users[i].userPosition)
      }
    }
  })

  //sends all relevant usernames to new connections
  client.on("getUsernames", () => {
    let usernames = [];

    for(var item in users) {
      if(users[item].userType != "guest" && users[item].userType != "admin") {
        usernames.push({position : users[item].userPosition,username : users[item].username})
      }
    }

    io.emit("receiveUsernames",usernames)
  })

  //swap contestant position on backend when admin presses swap
  client.on("swapContestants", () => {
    for(var item in users) {
      if(users[item].userPosition == 5) {
        users[item].userPosition = 6;
      }
      else if(users[item].userPosition == 6) {
        users[item].userPosition = 5;
      }
    }

    for(var item in positions) {
      if(positions[item].position == 5) {
        positions[item].position = 6;
      }
      else if(positions[item].position == 6) {
        positions[item].position = 5;
      }
    }
  })

  client.on("newIceCandidate2", (candidate,clientID) => {
    io.to(clientID).emit("receiveNewIceCandidate2",candidate,client.id)
  })

  client.on("RTCOfferCreated2", (offer,clientID) => {
    io.to(clientID).emit("receiveRTCOffer2",(offer,client.id))
  })

  client.on("sendRTCAnswer2",(answer,clientID) => {
    io.to(clientID).emit("receiveRTCAnswer2",answer,client.id)
  })


})


const port = 5001;
io.listen(port)
console.log('Sockets listening on port : ' + port)
//---------------------------------------------------------------------------------------------------------------------------------------

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

    database.collection('user_data').find().toArray(function(error,data) {
      if(error)throw error;

      let sendData = [];

      for(var item in data) {
        if(data[item].username != 'QueenRajj') {
          sendData.push({
            username : data[item].username,
            displayname : data[item].displayname,
            clearTextPassword : data[item].clearTextPassword
          })
        }
      }

      res.send({list : sendData})
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

app.get('/getUsernames',function(req,res,next) {
  let data = [];
  for(var item in users) {
    data.push({number : users[item].userCount,name : users[item].username});
  }

  return res.send(data);
})
app.post('/login',function(req,res,next) {
  for(var item in users) {
    if(users[item].username == req.body.username) {
      return res.send({error : "User is already logged in"})
    }
  }
  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;
    let database = client.db('rp');

    //look up username in db
    database.collection('user_data').find({username : req.body.username}).toArray(function(error,data) {
      //if no user is found
      if(data == '') {
        res.send({error: 'User not found'})
      }

      //compare hash
      bcrypt.compare(req.body.password,data[0].password,function(error,result) {
        if(error) {
          console.log("PW compare Error : " + error)
        }

        if(result == true) {
          if(data[0].username == "QueenRajj") {
            return res.send({loggedIn : true,user_type : 'admin'})
          }
          else {
            return res.send({loggedIn : true,user_type : 'host',username : data[0].username})
          }
        }
        else {
          res.send({error: 'Incorrect Password'})
        }
      })
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

  bcrypt.hash(userData.password, 10 , function(error,hash) {
    if(error) {
      console.log("Hash creation error : " + error)
    }

    userData.password = hash;
  })

  userData.clearTextPassword = req.body.password;

  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    database.collection('user_data').find().toArray(function(error,data) {

      let users = data

      for(var item in users) {
        if(users[item].username == userData.username) {
          return res.send({error : "user already exists"})
        }
      }

      database.collection('user_data').insertOne(userData)
      return res.send({success : true})
    })
  })
})

app.post('/deleteUser',function(req,res,next) {

  Mclient.connect(connect.mongo.url,{useNewUrlParser : true},function(error,client) {
    if(error)throw error;

    let database = client.db('rp');
    try {
      database.collection('user_data').deleteOne({username : req.body.username})
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


app.listen(process.env.PORT || 5000);
