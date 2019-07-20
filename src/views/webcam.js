import React,{Component} from 'react';
import Webrtc from 'simplewebrtc'

let RTCConnections = [];
let currentIndex = 0;
let contestantCount = 0;
let positionIndex = 0;
let contestantPosition = 0;

let socket;
let userType;
let audioID;
let remoteUserType;

export default class Webcam extends Component {

  //handle receiving remote tracks
  handleOnTrack = (event,position) => {
    //mount video based on remote users personalPosition
    var remoteVideo = document.querySelector('#cam' + position);

    if(remoteVideo) {
      remoteVideo.srcObject = event.streams[0]
      remoteVideo.muted = true;
    }
  }

  //send candidate and index of RTCConnection to backend
  handleIceCandidate = (event,index) => {
    if(event.candidate) {
      socket.emit("newIceCandidate",event.candidate,index)
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
    remoteUserType = "";

    //maps username to socket on the backend
    socket.emit("linkUserToSocket",this.props.localUsername,this.props.userType);
    const configuration = {iceServers: [{urls: 'stun:stun.example.com'}]};

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {

      //mount props as local variables due to function scope
      var userType = this.props.userType;
      var remoteUserType = "";

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

      //when another client connects
      socket.on("createNewRTCOffer", (clientID) => {
        //create new RTC connection and add it to the connection array, correct the currentindex
        RTCConnections.push(new RTCPeerConnection(configuration));
        currentIndex = RTCConnections.length - 1;
        RTCConnections[currentIndex].index = currentIndex;

        positionIndex += 1;
        RTCConnections[currentIndex].positionIndex = positionIndex;

        //add ice candidate handler
        RTCConnections[currentIndex].onicecandidate = ( event => this.handleIceCandidate(event,RTCConnections[currentIndex].index))

        //add local stream to new RTC object
        stream.getTracks().forEach(track => RTCConnections[currentIndex].addTrack(track,stream))

        //create offer and emit to backend socket for relay to new client
        RTCConnections[currentIndex].createOffer()
        .then( (offer) => {
          RTCConnections[currentIndex].setLocalDescription(offer)
          offer.destinationID = clientID
          offer.index = currentIndex
          offer.remoteUsername = this.props.localUsername;
          offer.remoteUserType = this.props.userType;
          offer.position = this.props.personalPosition;
          socket.emit("RTCOfferCreated",offer)
        })
      })

      //receive rtc offer when this client is the newest one
      socket.on("receiveRTCOffer", (offer) => {
        RTCConnections.push(new RTCPeerConnection(configuration));
        currentIndex = RTCConnections.length - 1;
        RTCConnections[currentIndex].index = currentIndex;

        if(offer.remoteUserType == "host") {
          positionIndex += 1;
          RTCConnections[currentIndex].positionIndex = positionIndex;
        }
        else if (offer.remoteUserType == "guest") {
          contestantPosition += 1;
          RTCConnections[currentIndex].positionIndex = contestantPosition;
        }

        RTCConnections[currentIndex].remoteUsername = offer.remoteUsername;
        RTCConnections[currentIndex].remoteUserType = offer.remoteUserType;
        remoteUserType = offer.remoteUserType;

        RTCConnections[currentIndex].onicecandidate = ( event => this.handleIceCandidate(event,RTCConnections[currentIndex].index))
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
            answer.remoteUsername = this.props.localUsername;
            answer.remoteUserType = this.props.userType;
            answer.position = this.props.personalPosition
            socket.emit("sendRTCAnswer",answer)

            //this.props.updateUsername(currentIndex + 1, offer.remoteUsername)
          })
        })
      })

      socket.on("receiveRTCAnswer", (answer) => {
        RTCConnections[answer.index].remoteUsername = answer.remoteUsername;
        RTCConnections[answer.index].ontrack = ((event) => this.handleOnTrack(event,answer.position))

        RTCConnections[answer.index].setRemoteDescription(answer)
        RTCConnections[answer.index].remoteSocketID = answer.originID
        RTCConnections[answer.index].remoteUserType = answer.remoteUserType;

        RTCConnections[answer.index].remotePosition = answer.position;

        remoteUserType = answer.remoteUserType;
        //this.props.updateUsername(answer.index + 1,answer.remoteUsername)
      })

      //adds ics candidates to RTCPeerConnection object
      socket.on("receiveNewIceCandidate", (candidate,index) => {
        if(candidate != null) {
          try {
            RTCConnections[index].addIceCandidate(candidate)
          }
          catch(error) {
            console.log("error adding ice candidate : " + error)
          }
        }
      })

      //handle cleanup after user disconnects
      socket.on("clientDisconnect", (id) => {
        console.log("client " + id + " disconnected")
        for(var item in RTCConnections) {


          if(RTCConnections[item].remoteSocketID == id) {
            var video = document.querySelector('#cam' + RTCConnections[item].remotePosition)

            //unmount video
            if(video) {
              video.srcObject = null;
            }

            //clear username
            this.props.updateUsername(RTCConnections[item].remotePosition, "")

            //close connection
            RTCConnections[item].close()
            //remove object from array
            RTCConnections.splice(RTCConnections.indexOf(RTCConnections[item],1))
          }
        }
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
