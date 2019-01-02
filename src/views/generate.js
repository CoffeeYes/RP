import React, { Component } from 'react';

class Generate extends Component {

  render() {
    return (
        <form className="generateForm">
          {
            this.props.showCopied &&
            <p>Copied!</p>
          }
          <button onClick={this.props.createCode} className="generateButton">Generate Code</button>
        </form>
    );
  }
}

export default Generate;
