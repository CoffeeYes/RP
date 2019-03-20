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



      //create RTC object
      let thisPC = new RTCPeerConnection() || window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;

      //negotiation event handler, adding tracks fires negotiation needed
      function handleNegotiationNeededEvent() {
        //get number of connected clients from server
        socket.emit("getConnectedClientCount")
        socket.on("returnConnectedClientCount",(count) => {
          //create offers for the number of connected clients
          let offers = []
          for(var i = 1; i < count ; i++) {
            //createOffer is async, so we check for length match in the .then block before emitting offers array, otherwise empty synchronous array is emitted
            thisPC.createOffer()
            .then(function(offer) {
              offers.push(offer)

              if(offers.length == count - 1) {
                socket.emit("newRTCConnections",offers)
              }
            })
          }
        })


      }
      thisPC.onnegotiationneeded = handleNegotiationNeededEvent()

      //add mediadevices tracks to the rtc object
      stream.getTracks().forEach(track => thisPC.addTrack(track,stream))

      //handle receiving of RTC offer
      socket.on("receiveRTCConnection",function(offer) {
        console.log("new RTC offer received from server")
        console.log(offer)
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
