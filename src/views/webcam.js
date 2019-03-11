import React,{Component} from 'react';

export default class Webcam extends Component {

  componentDidMount = () => {
    let constraints = {
      video : {width: 640,height : 480}
    }

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      this.setState({videoSrc : stream })
      var video = document.querySelector('#testCam')
      video.srcObject = stream
    })
  }
  render() {
    return(
      <video autoPlay="true" className="cam2" id="testCam"></video>
    )
  }
}
