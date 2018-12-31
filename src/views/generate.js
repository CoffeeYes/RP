import React, { Component } from 'react';

class Generate extends Component {

  render() {
    return (
      <div className="horizontal-center">
        <form className="generateForm">
          <button onClick={this.props.createCode} className="generateButton">Generate Code</button>
        </form>
      </div>
    );
  }
}

export default Generate;
