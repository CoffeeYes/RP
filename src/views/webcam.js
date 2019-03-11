import React,{Component} from 'react';

export default class Webcam extends Component {
  constructor(props) {
    super(props)

    this.videoRef = React.createRef()
    this.state = {
      videoSrc : new MediaStream()
    }
  }

  componentDidMount() {
    let constraints = {
      video : {width: 640,height : 480},
      audio: true
    }

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      this.setState({videoSrc : stream})
      this.videoRef.current.srcObject = this.state.videoSrc;
    })
  }
  render() {
    return(
      <video autoplay ref={this.videoRef} className="cam2"></video>
    )
  }
}
