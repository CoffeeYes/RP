import React,{Component} from 'react';
import Webrtc from 'simplewebrtc'

let RTCConnections = [];
let RTCCons = {};
let currentIndex = 0;
let contestantCount = 0;
let contestantPosition = 0;

let socket;
let userType;
let audioID;
let remoteUserType;
var socketID;

export default class Webcam extends Component {

  //handle receiving remote tracks
  handleOnTrack = (event,position) => {
    //mount video based on remote users personalPosition
    if(event.streams) {
      var remoteVideo = document.querySelector('#cam' + position);

      if(remoteVideo) {
        remoteVideo.srcObject = event.streams[0]
        remoteVideo.muted = true;
      }
    }
  }

  //send candidate and ID of RTCConnection remotesocketID to backend
  handleIceCandidate = (event,remoteSocketID) => {
    if(event.candidate) {
      socket.emit("newIceCandidate",event.candidate,remoteSocketID)
    }
  }

  componentDidMount = () => {
    let constraints = {
      video : {width: 640,height : 480},
      audio : true
    }

    socket = this.props.socket;
    userType = this.props.userType;
    audioID = this.props.audioID;

    //maps username to socket on the backend
    socket.emit("linkUserToSocket",this.props.localUsername,this.props.userType);
    const configuration = {iceServers: [{urls: 'stun:stun.example.com'}]};

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {

      //mount props as local variables due to function scope
      var userType = this.props.userType;

      //webcam mounting location selection
      if(this.props.userType != 'admin') {

        //mount local users video
        var localCam;
        localCam = document.querySelector('#cam' + this.props.personalPosition)
        localCam.srcObject = stream
        localCam.muted = true;
      }

      //let the server know the user allowed the webcam so it can begin RTC handshake
      socket.emit("newWebcamMounted")

      socket.on("receiveSelfSocketID", (id) => {
        socketID = id;
      })

      //when another client connects
      socket.on("createNewRTCOffer", (clientID) => {
        //create new RTC connection and add it to the connection object
        RTCCons[clientID] =  new RTCPeerConnection(configuration);

        //attach ice candidate handler
        RTCCons[clientID].onicecandidate = ( event => this.handleIceCandidate(event,clientID))

        //attach media tracks to rtc object
        stream.getTracks().forEach(track => RTCCons[clientID].addTrack(track,stream))

        //initiate RTC handshake
        RTCCons[clientID].createOffer()
        .then( offer => {
          RTCCons[clientID].setLocalDescription(offer)
          offer.destinationID = clientID;
          offer.originID = socketID
          offer.position = this.props.personalPosition;
          socket.emit("RTCOfferCreated",offer,clientID)
        })
      })


      //receive rtc offer when this client is the newest one
      socket.on("receiveRTCOffer", (offer,remoteSocket) => {

        RTCCons[remoteSocket] = new RTCPeerConnection(configuration);

        RTCCons[remoteSocket].onicecandidate = ( event => this.handleIceCandidate(event,remoteSocket))
        RTCCons[remoteSocket].ontrack = ((event) => this.handleOnTrack(event,offer.position))

        RTCCons[remoteSocket].remotePosition = offer.position

        stream.getTracks().forEach(track => RTCCons[remoteSocket].addTrack(track,stream))

        RTCCons[remoteSocket].setRemoteDescription(offer)
        .then( () => {
          RTCCons[remoteSocket].createAnswer()
          .then( answer => {
            RTCCons[remoteSocket].setLocalDescription(answer)
            answer.position = this.props.personalPosition
            answer.destinationID = offer.originID;
            answer.originID = offer.destinationID;
            socket.emit("sendRTCAnswer",answer,remoteSocket)
          })
        })
      })



      socket.on("receiveRTCAnswer", (answer,clientID) => {

          RTCCons[clientID].ontrack = ( (event) => this.handleOnTrack(event,answer.position))

          RTCCons[clientID].setRemoteDescription(answer)

          RTCCons[clientID].remotePosition = answer.position;

      })

      //adds ics candidates to RTCPeerConnection object
      socket.on("receiveNewIceCandidate", (candidate,remoteSocketID) => {
        if(candidate != null) {
          try {
            RTCCons[remoteSocketID].addIceCandidate(candidate)
          }
          catch(error) {
            console.log("error adding ice candidate : " + error)
          }
        }
      })

      //handle cleanup after user disconnects
      socket.on("clientDisconnect", (id) => {
        if(RTCCons[id] != undefined) {
          var video = document.querySelector('#cam' + RTCCons[id].remotePosition)

          if(video) {
            video.srcObject = null;
          }

          //clear username
          this.props.updateUsername(RTCCons[id].remotePosition, "")

          RTCCons[id].close();

          delete RTCCons[id]
        }
        else {
          console.log("RTC Connection item not found in RTCCons")
        }

      })

      socket.on("userWasKicked",(position,id) => {
        console.log("position : " + position)
        if(RTCCons[id] != undefined) {
          var video = document.querySelector('#cam' + position);

          if(video) {
            video.srcObject = null;
          }

          //clear username
          this.props.updateUsername(RTCCons[id].remotePosition, "")

          RTCCons[id].close();

          delete RTCCons[id]
        }
      })

      socket.on("receiveKick", () => {
        //clear RTC connections object
        for(var item in RTCCons) {
          RTCCons[item].close()

          delete RTCCons[item]
        }

        //unmount all video from screen
        for(var i = 1; i < 7; i++) {
          var video = document.querySelector('#cam' + i)

          video.srcObject = null
        }

        this.props.kickUserFromLobby()
      })

    })
    .catch(error => {
      console.log("Media Error : " + error)
    })
  }
  render() {
    return null;
  }
}
