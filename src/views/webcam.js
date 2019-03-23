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

    let RTCConnections = [];
    let currentIndex = 0;

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      this.setState({videoSrc : stream })
      var video = document.querySelector('#testCam')
      video.srcObject = stream

      //when another client connects
      socket.on("createNewRTCOffer", (clientID) => {
        //create new RTC connection and add it to the connection array, correct the currentindex
        RTCConnections.push(new RTCPeerConnection());
        currentIndex = RTCConnections.length - 1;

        //add local stream to new RTC object
        stream.getTracks().forEach(track => RTCConnections[currentIndex].addTrack(track,stream))

        //create offer and emit to backend socket for relay to new client
        RTCConnections[currentIndex].createOffer()
        .then( (offer) => {
          offer.destinationID = clientID
          socket.emit("RTCOfferCreated",offer)
        })
      })

      //receive rtc offer when this client is the newest one
      socket.on("receiveRTCOffer", (offer) => {
        console.log("Offer received")

        RTCConnections.push(new RTCPeerConnection());
        currentIndex = RTCConnections.length - 1;

        RTCConnections[currentIndex].setRemoteDescription(offer)
        .then ( (Offer) => {
          RTCConnections[currentIndex].createAnswer()
          .then( (answer) => {
            //reverse destination and origin for the answer
            console.log(offer)
            answer.originID = offer.destinationID;
            answer.destinationID = offer.originID;

            socket.emit("sendRTCAnswer",answer)
          })
        })
      })

      socket.on("receiveRTCAnswer", (answer) => {
        console.log("Answer Received");
        console.log(answer)
      })
    })
    .catch(error => {
      console.log("Media Error : " + error)
    })





      /*
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
      socket.on("receiveNewRTCOffer",function(offer) {
        console.log("new RTC offer received from server")

        //set remote description to the received offer
        thisPC.setRemoteDescription(offer)
        .then(() => {
          console.log("remote description set")
          //create an answer, set it as local description and forward it to server
           thisPC.createAnswer()
           .then( (answer) => {
             console.log("answer created")
             thisPC.setLocalDescription(answer)
             .then( () => {
               socket.emit("createdRTCAnswer",answer)
             })
           })
        })
      })


      socket.on("receiveRTCAnswer", (answer) => {
        thisPC.setRemoteDescription(answer)
        .then( () => {
          console.log("RTC peer connection complete")
        })
      })
    })
    .catch( error => {
      console.log(error)
    })
    */
  }
  render() {
    return(
      <video autoPlay={true} className="cam2" id="testCam"></video>
    )
  }
}
