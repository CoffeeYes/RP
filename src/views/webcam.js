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
        //create new RTC connection and add it to the connection array, correct the currentindex
        RTCConnections.push(new RTCPeerConnection(configuration));
        /*
        currentIndex = RTCConnections.length - 1;
        RTCConnections[currentIndex].index = currentIndex;
        RTCConnections[currentIndex].remoteSocketID = clientID;

        //add ice candidate handler
        RTCConnections[currentIndex].onicecandidate = ( event => this.handleIceCandidate(event,RTCConnections[currentIndex].remoteSocketID))

        //add local stream to new RTC object
        stream.getTracks().forEach(track => RTCConnections[currentIndex].addTrack(track,stream))

        //create offer and emit to backend socket for relay to new client
        RTCConnections[currentIndex].createOffer()
        .then( (offer) => {
          RTCConnections[currentIndex].setLocalDescription(offer)
          offer.destinationID = clientID
          offer.index = currentIndex
          offer.position = this.props.personalPosition;
          socket.emit("RTCOfferCreated",offer,clientID)
        })
        */
        RTCCons[clientID] =  new RTCPeerConnection(configuration);

        RTCCons[clientID].onicecandidate = ( event => this.handleIceCandidate(event,clientID))

        stream.getTracks().forEach(track => RTCCons[clientID].addTrack(track,stream))

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
        /*
        RTCConnections.push(new RTCPeerConnection(configuration));
        currentIndex = RTCConnections.length - 1;
        RTCConnections[currentIndex].index = currentIndex;
        RTCConnections[currentIndex].remoteSocketID = remoteSocket;

        RTCConnections[currentIndex].onicecandidate = ( event => this.handleIceCandidate(event,RTCConnections[currentIndex].remoteSocketID))
        RTCConnections[currentIndex].ontrack = ((event) => this.handleOnTrack(event,offer.position))

        RTCConnections[currentIndex].remotePosition = offer.position;

        //add local stream to new RTC object
        stream.getTracks().forEach(track => RTCConnections[currentIndex].addTrack(track,stream))

        RTCConnections[currentIndex].setRemoteDescription(offer)
        .then ( (Offer) => {
          RTCConnections[currentIndex].remoteSocketID= offer.originID
          RTCConnections[currentIndex].createAnswer()
          .then( (answer) => {
            RTCConnections[currentIndex].setLocalDescription(answer)
            //reverse destination and origin for the answer
            answer.originID = offer.destinationID;
            answer.destinationID = offer.originID;
            answer.index = offer.index;
            answer.position = this.props.personalPosition
            socket.emit("sendRTCAnswer",answer,remoteSocket)
          })
        })
        */

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
        /*
        RTCConnections[answer.index].remoteUsername = answer.remoteUsername;
        RTCConnections[answer.index].ontrack = ((event) => this.handleOnTrack(event,answer.position))

        RTCConnections[answer.index].setRemoteDescription(answer)
        RTCConnections[answer.index].remoteSocketID = answer.originID

        RTCConnections[answer.index].remotePosition = answer.position;
        */

          RTCCons[clientID].ontrack = ( (event) => this.handleOnTrack(event,answer.position))

          RTCCons[clientID].setRemoteDescription(answer)

          RTCCons[clientID].remotePosition = answer.position;

        /*
        for(var item in RTCConnections) {
          if(RTCConnections[item].remoteSocketID == clientID) {
            RTCConnections[item].setRemoteDescription(answer)
            RTCConnections[item].ontrack = ((event) => this.handleOnTrack(event,answer.position))
            RTCConnections[item].remotePosition = answer.position;
          }
        }
        */
      })

      //adds ics candidates to RTCPeerConnection object
      socket.on("receiveNewIceCandidate", (candidate,remoteSocketID) => {
        if(candidate != null) {
          try {
            /*
            //match rtc object based on received socketID
            for(var item in RTCConnections) {
              if (RTCConnections[item].remoteSocketID == remoteSocketID) {
                RTCConnections[item].addIceCandidate(candidate)
              }
            }
            */
            RTCCons[remoteSocketID].addIceCandidate(candidate)
          }
          catch(error) {
            console.log("error adding ice candidate : " + error)
          }
        }
      })

      //handle cleanup after user disconnects
      socket.on("clientDisconnect", (id) => {
        var video = document.querySelector('#cam' + RTCCons[id].remotePosition)

        if(video) {
          video.srcObject = null;
        }

        //clear username
        this.props.updateUsername(RTCCons[id].remotePosition, "")

        RTCCons[id].close();

        delete RTCCons[id]
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
