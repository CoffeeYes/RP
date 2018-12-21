import React, { Component } from 'react';

class Code extends Component {

  render() {
    return (
      <div className="content-container">
        <form className="codeForm">
          <p className="error">{this.props.error}</p>
          <h2>Enter your code</h2>
          <input name="codeInput" onChange={this.props.handleTextChange}/>
          <button onClick={this.props.handleCode}>Submit</button>
        </form>
      </div>
    );
  }
}

export default Code;
