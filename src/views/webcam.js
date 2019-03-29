import React,{Component} from 'react';
import Webrtc from 'simplewebrtc'

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5001')

let RTCConnections = [];
let currentIndex = 0;

export default class Webcam extends Component {

  constructor(props) {
    super(props)

    this.state = {
      videoSrc: null
    }
  }

  componentDidMount = () => {
    let constraints = {
      video : {width: 640,height : 480}
    }

    const configuration = {iceServers: [{urls: 'stun:stun.example.com'}]};

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      this.setState({videoSrc : stream })
      var video = document.querySelector('#testCam')
      video.srcObject = stream

      //function to handle ice candidate
      function handleIceCandidate(event) {
        if(event.candidate) {
          console.log(event.candidate)
          socket.emit("newIceCandidate",event.candidate)
        }
        else {
          console.log("all ICE candidates sent")
        }
      }

      //handle receiving remote tracks
      function handleOnTrack(event) {
        console.log(RTCConnections.length)
        var remoteVideo = document.querySelector(['#remote' + RTCConnections.length])
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

        //add ice candidate handler
        RTCConnections[currentIndex].onicecandidate = handleIceCandidate

        //add local stream to new RTC object
        stream.getTracks().forEach(track => RTCConnections[currentIndex].addTrack(track,stream))

        //create offer and emit to backend socket for relay to new client
        RTCConnections[currentIndex].createOffer()
        .then( (offer) => {
          RTCConnections[currentIndex].setLocalDescription(offer)
          offer.destinationID = clientID
          socket.emit("RTCOfferCreated",offer)
        })
      })

      //receive rtc offer when this client is the newest one
      socket.on("receiveRTCOffer", (offer) => {
        console.log("Offer received")

        RTCConnections.push(new RTCPeerConnection(configuration));
        currentIndex = RTCConnections.length - 1;

        RTCConnections[currentIndex].onicecandidate = handleIceCandidate
        RTCConnections[currentIndex].ontrack = handleOnTrack

        //add local stream to new RTC object
        stream.getTracks().forEach(track => RTCConnections[currentIndex].addTrack(track,stream))

        RTCConnections[currentIndex].setRemoteDescription(offer)
        .then ( (Offer) => {
          RTCConnections[currentIndex].createAnswer()
          .then( (answer) => {
            RTCConnections[currentIndex].setLocalDescription(answer)
            //reverse destination and origin for the answer
            answer.originID = offer.destinationID;
            answer.destinationID = offer.originID;

            socket.emit("sendRTCAnswer",answer)
          })
        })
      })

      socket.on("receiveRTCAnswer", (answer) => {
        console.log("Answer Received");

        RTCConnections[currentIndex].ontrack = handleOnTrack

        RTCConnections[currentIndex].setRemoteDescription(answer)
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


    })
    .catch(error => {
      console.log("Media Error : " + error)
    })
  }
  render() {
    return(
      <div>
        <video autoPlay={true} className="cam2" id="testCam"></video>
        <video autoPlay={true} className="cam2" id="remoteCam"></video>
      </div>
    )
  }
}
