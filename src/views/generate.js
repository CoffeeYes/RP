import React, { Component } from 'react';

class Generate extends Component {

  render() {
    return (
        <form className="generateForm">
          <button onClick={this.props.createCode} className="generateButton">Generate Code</button>
        </form>
    );
  }
}

export default Generate;
