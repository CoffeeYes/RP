const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const connect = require('./src/connect.js');
const Mclient = require('mongodb').MongoClient;
const mongoClientOptions = {useNewUrlParser: true,useUnifiedTopology : true}

const bcrypt = require('bcrypt')

const io = require('socket.io')();
const socketStream = require('socket.io-stream');

//---------------------------------------------------------------- sockets --------------------------------------------------------------
let offers = []
let currentOfferHost = '';
let users = [];
let userPositionCount = -1;
let positions = [];
let freeContestantPositions = [5,6]
let freeUserPositions = [1,2,3,4]
let adminUserType = "admin";
let hostUserType = "host";
let guestUserType = "guest";
let bachelorUserList = [];
let bachelorPositionList = [1,2,3,4,5,6,7,8,9,10,11,12]

function emitSocketsAndPositions() {
  var socketsAndPositions = [];
  for(var item in users) {
    var currentUser = {
      position : users[item].userPosition,
      socket : users[item].socketID
    }

    socketsAndPositions.push(currentUser)
  }

  io.emit("receiveSocketsAndPositions",socketsAndPositions)
}

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
  client.on("RTCOfferCreated", (offer,clientID) => {
    //save the origin of the offer and forward it to the destination client
    offer.originID = client.id;
    io.to([clientID]).emit("receiveRTCOffer",offer,client.id)
  })

  //forward RTC answer to the offer creator
  client.on("sendRTCAnswer", (answer,clientID) => {
    io.to([clientID]).emit("receiveRTCAnswer",answer,client.id)
  })

  //relay the new ICE candidate to other clients
  client.on("newIceCandidate", (candidate,remoteSocketID) => {
    //client.broadcast.emit("receiveNewIceCandidate",candidate,index)

    //send the candidate and source ID to the saved remote ID of the RTCconnection object
    io.to(remoteSocketID).emit("receiveNewIceCandidate",candidate,client.id)
  })

  client.on("disconnect", () => {

    io.emit("clientDisconnect",client.id)

    for(var i = 0; i < users.length; i++) {
      if(users[i].socketID == client.id) {

        //add leaving users position to the available positions array based on usertype
        if(users[i].userType == hostUserType) {
          io.emit("resetSingleVote",users[i].userPosition)
          freeUserPositions.push(users[i].userPosition)
          freeUserPositions.sort()
        }
        else if(users[i].userType == guestUserType) {
          freeContestantPositions.push(users[i].userPosition)
          freeContestantPositions.sort()
        }
        //remove user from array
        users.splice(i,1);
      }
    }

    for(var a = 0 ; a< bachelorUserList.length; a++) {
      if(bachelorUserList[a].socketID == client.id) {
        //add user to be removed position to position array and sort it
        bachelorPositionList.push(bachelorUserList[a].position)
        bachelorPositionList.sort(function(a,b) {return a-b})
        //remove user from array
        bachelorUserList.splice(a,1);
        //send new array to frontend for re-render
        io.emit("receiveBachelorUserList",bachelorUserList)
      }
    }
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
      //pull first free position from array based on user type
        if(userType == hostUserType) {
          if(freeUserPositions[0]) {
            actualPosition = freeUserPositions[0]
            freeUserPositions.shift()
          }
        }
        else if(userType == adminUserType){
          actualPosition = 0;
        }
        else {
          //contestant position starts at cam 5, so a separate array is available
          if(freeContestantPositions[0]) {
            actualPosition = freeContestantPositions[0];
            freeContestantPositions.shift();
          }
          else {
            console.log("no free contestant positions available")
          }
        }
        positions.push({username : username,position : actualPosition})

      //add data to user array
      if(userType != guestUserType) {
        users.push({username : username,socketID : client.id,userCount : userPositionCount,userPosition : actualPosition,userType: userType});
      }
      else {
        users.push({username : ["contestant" + actualPosition],socketID : client.id,userCount : userPositionCount,userPosition : actualPosition,userType: userType})
      }
      //re-emit all usernames so clients can update their positions on frontend
      let usernames = [];
      for(var item in users) {
        //empty username signifies admin
        if(users[item].username != "contestant1" && users[item].username != "contestant2") {
          usernames.push({position : users[item].userPosition,username : users[item].username})
        }
      }
      //send all usernames and own socket id to user
      io.to([client.id]).emit("receiveUsernames",usernames)
      io.to([client.id]).emit("receiveSelfSocketID",client.id)

    //update socket id's and their corresponding positions on frontend
    emitSocketsAndPositions();


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
      if(users[i].userType != guestUserType) {
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
      if(users[item].userType != guestUserType && users[item].userType != adminUserType) {
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
        io.to(users[item].socketID).emit("receivePersonalPosition",6);
      }
      else if(users[item].userPosition == 6) {
        users[item].userPosition = 5;
        io.to(users[item].socketID).emit("receivePersonalPosition",5);
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

    io.emit("contestantsWereSwapped")

    emitSocketsAndPositions();
  })

  client.on("kickUser", (camID) => {

    var kickedUserPosition;

    for(var i = 0; i < users.length; i++) {
      if(users[i].socketID == camID) {
        //save the position of the user being kicked
        kickedUserPosition = users[i].userPosition

        //add user's position back to free position array based on type
        if(users[i].userType == hostUserType) {
          io.emit("resetSingleVote",users[i].userPosition)
          freeUserPositions.push(users[i].userPosition)
          freeUserPositions.sort()
        }
        else if(users[i].userType == guestUserType) {
          freeContestantPositions.push(users[i].userPosition)
          freeContestantPositions.sort()
        }

        //remove this user from the array
        users.splice(i,1)
      }
    }
    for(var i = 0; i < bachelorUserList.length; i++) {

      if(bachelorUserList[i].socketID == camID) {
        //add kicked users position back to free positions list
        bachelorPositionList.push(bachelorUserList[i].position)
        bachelorPositionList.sort(function(a,b) {return a-b})

        //remove kicked user from bachelor user list and emit back to frontend
        bachelorUserList.splice(i,1)
        io.emit("receiveBachelorUserList",bachelorUserList)
      }
    }

    try {
      io.to(camID).emit("receiveKick");

      //this line causes wrong cam to be unmounted on frontend
      //io.sockets.connected[camID].disconnect();

      console.log("kicked user position : " + kickedUserPosition)

      io.emit("userWasKicked",kickedUserPosition,camID);

      emitSocketsAndPositions();

      //update database roomcode
      Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
        if(error)throw error;

        let database = client.db('rp');

        database.collection('app_data').updateOne({title: 'accessCode'},{$set : {data : Math.random().toString(36)}});
      })
    }
    catch(error) {
      console.log("Error kicking user : " + error)
    }

  })


  client.on("userJoinedBachelorLobby",(userType) => {
    if(userType != adminUserType) {
      let username;

      for(var item in users) {
        if(users[item].socketID == client.id) {
          username = users[item].username
        }
      }
      //add user to user array
      bachelorUserList.push({position : bachelorPositionList[0],socketID : client.id,username : username})
      //remove position that was just assigned from position array
      bachelorPositionList.splice(0,1)

    }
    //send users and array to frontend for render
    io.emit("receiveBachelorUserList",bachelorUserList)
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
  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
    if(error)throw error;
    let database = client.db('rp');

    database.collection('app_data').find({title: "modes"}).toArray(function(error,data) {
      if(error)throw error;
      res.send({modes : data[0].data});
    })
  })
})

app.get('/mode',function(req,res,next){
  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client){
    if(error)throw error;

    let database = client.db('rp');

    database.collection('app_data').find({title : 'currentMode'}).toArray(function(error,data) {
      if(error) throw error;
      res.send({mode : data[0].data});
    })
  })
})

app.get('/getUsers',function(req,res,next) {
  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client){
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

app.get('/getUsernames',function(req,res,next) {
  let data = [];
  for(var item in users) {
    data.push({number : users[item].userCount,name : users[item].username});
  }

  return res.send(data);
})

app.get('/getTimerValues', (req,res) => {
  Mclient.connect(connect.mongo.url,mongoClientOptions, (error,client) => {
    database = client.db('rp')

    database.collection('app_data').find({title : "timerValues"}).toArray( (error,array) => {
      if(error)throw error;

      res.send({timerValues : array[0].values})
    })
  })
})

app.post('/updateTimerValues',(req,res) => {
  Mclient.connect(connect.mongo.url,mongoClientOptions, (error,client) => {
    database = client.db('rp')

    database.collection('app_data').updateOne({title : "timerValues"},{$set : {"values.minutes" : req.body.minutes,"values.seconds" : req.body.seconds}})
    res.send({success : true})
  })
})
app.post('/login',function(req,res,next) {
  for(var item in users) {
    if(users[item].username == req.body.username) {
      return res.send({error : "User is already logged in"})
    }
  }
  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
    if(error)throw error;
    let database = client.db('rp');

    //look up username in db
    database.collection('user_data').find({username : req.body.username}).toArray(function(error,data) {
      //if no user is found
      if(data == '') {
        return res.send({error: 'User not found'})
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
  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
    if(error)throw error;

    let database = client.db('rp');
    try {
      database.collection('app_data').updateOne({title : 'currentMode'},{$set : {"data" : req.body.modeChoice}});
      res.send({success : true})
    }
    catch(error) {
      console.log('database could not be updated (MODE) : ' + error)
      res.send({success : false})
    }
  })
})

app.post('/roomCode',function(req,res,next) {
  let code = req.body.code

  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    //compare entered code to database code
    database.collection('app_data').find({title : 'accessCode'}).toArray(function(error,data) {
      if(code == data[0].data) {
        res.send({sucess : true,user_type : 'guest'})
      }
      else {
        res.send({error : "Wrong Code",sucess : false})
      }
    })
  })
})

app.post('/createCode',function(req,res,next) {
  let code = req.body.code;

  //update database roomcode
  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
    if(error)throw error;

    let database = client.db('rp');

    database.collection('app_data').updateOne({title: 'accessCode'},{$set : {data : code}});
  })

  setTimeout( () => {
    Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
      if(error)throw error;

      let database = client.db('rp');

      database.collection('app_data').updateOne({title: 'accessCode'},{$set : {data : ''}});
    })
  },180000)
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

  Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
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
  try {
    Mclient.connect(connect.mongo.url,mongoClientOptions,function(error,client) {
      if(error)throw error;

      let database = client.db('rp');
      try {
        database.collection('user_data').deleteOne({username : req.body.username})
        res.send({success : true,error : ""})
      }
      catch(error) {
        console.log("ERROR(deleting user) : " + error)
      }
    })
  }
  catch(error) {
    console.log("Error connecting to database : " + error)
  }
})

app.listen(process.env.PORT || 5000);
