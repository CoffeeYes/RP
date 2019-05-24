import React,{Component} from 'react';
import Webrtc from 'simplewebrtc'

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5001')

let RTCConnections = [];
let currentIndex = 0;
let contestantCount = 0;
let positionIndex = 0;
let contestantPosition = 0;

export default class Webcam extends Component {
  componentDidMount = () => {
    let constraints = {
      video : {width: 640,height : 480},
      audio : true
    }

    let userType = this.props.userType;
    let remoteUserType = "";

    socket.emit("linkUserToSocket",this.props.localUsername);
    const configuration = {iceServers: [{urls: 'stun:stun.example.com'}]};

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {

      var userType = this.props.userType;
      var remoteUserType = "";

      //if(this.props.userType != 'admin') {
      var localCam;
      if(this.props.userType == "guest") {
        localCam = document.querySelector('#contestant1')
      }
      else {
        localCam = document.querySelector('#localCam')
      }
      localCam.srcObject = stream
      //}

      //function to handle ice candidate
      function handleIceCandidate(event) {
        if(event.candidate) {
          socket.emit("newIceCandidate",event.candidate)
        }
      }


      //handle receiving remote tracks
      function handleOnTrack(event) {
        //choose mounting position based on user type
        if(remoteUserType == "host") {
          var remoteVideo = document.querySelector(['#remote' + RTCConnections.length])
        }
        else if(remoteUserType == "guest") {
          contestantCount += 1;
          var remoteVideo = document.querySelector(['#contestant' + contestantCount])
        }


        if(remoteVideo) {
          remoteVideo.srcObject = event.streams[0]
        }
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
        RTCConnections[currentIndex].positionIndex = currentIndex;

        //add ice candidate handler
        RTCConnections[currentIndex].onicecandidate = handleIceCandidate

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

        RTCConnections[currentIndex].onicecandidate = handleIceCandidate
        RTCConnections[currentIndex].ontrack = handleOnTrack

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
            socket.emit("sendRTCAnswer",answer)

            this.props.updateUsername(currentIndex + 1, offer.remoteUsername)
          })
        })
      })

      socket.on("receiveRTCAnswer", (answer) => {
        RTCConnections[answer.index].remoteUsername = answer.remoteUsername;
        RTCConnections[answer.index].ontrack = handleOnTrack

        RTCConnections[answer.index].setRemoteDescription(answer)
        RTCConnections[answer.index].remoteSocketID = answer.originID
        RTCConnections[answer.index].remoteUserType = answer.remoteUserType;

        remoteUserType = answer.remoteUserType;
        this.props.updateUsername(answer.index + 1,answer.remoteUsername)
      })

      socket.on("receiveNewIceCandidate", (candidate) => {
        if(candidate != null) {
          try {
            RTCConnections[currentIndex].addIceCandidate(candidate)
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
            //unmount video choosing location based on usertype
            if(RTCConnections[item].remoteUserType == "host") {
              var video = document.querySelector("#remote" + RTCConnections[item].positionIndex);
              positionIndex -= 1;
            }
            else if(RTCConnections[item].remoteUserType == "guest") {
              var video = document.querySelector("#contestant" + RTCConnections[item].positionIndex);
              positionIndex -= 1;
            }

            if(video) {
              video.srcObject = null;
            }

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
