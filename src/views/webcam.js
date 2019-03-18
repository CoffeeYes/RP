import React,{Component} from 'react';
import Webrtc from 'simplewebrtc'

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5001')

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

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      this.setState({videoSrc : stream })
      var video = document.querySelector('#testCam')
      video.srcObject = stream
      socket.emit('webcamConnect')

      //create RTC object
      let thisPC = new RTCPeerConnection() || window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;

      //negotiation event handler, adding tracks fires negotiation needed
      function handleNegotiationNeededEvent() {
        thisPC.createOffer()
        .then(function(offer) {
          socket.emit("newRTCConnection",offer)
          return thisPC.setLocalDescription(offer);
        })
      }
      thisPC.onnegotiationneeded = handleNegotiationNeededEvent()

      //add mediadevices tracks to the rtc object
      stream.getTracks().forEach(track => thisPC.addTrack(track,stream))

      socket.on("receiveRTCConnection",function(offer) {
        console.log("new RTC offer received from server")
      })
    })
    .catch( error => {
      console.log(error)
    })



  }
  render() {
    return(
      <video autoPlay={true} className="cam2" id="testCam"></video>
    )
  }
}
