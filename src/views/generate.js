import React, { Component } from 'react';

class Generate extends Component {

  render() {
    return (
      <div className="horizontal-center">
        <form className="generateForm">
          <input name="codeOutput"/>
          <button onClick={this.props.handleCode}>Generate</button>
        </form>
      </div>
    );
  }
}

export default Generate;
