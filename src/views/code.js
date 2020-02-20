import React, { Component } from 'react';

class Code extends Component {

  render() {
    return (
      <div className="content-container-main">
        <div className="codeFormContainer">
          <form className="codeForm">
            <p className="error">{this.props.error}</p>
            <h2>Enter your code</h2>
            <input name="codeInput" className="addUserInput" onChange={this.props.handleTextChange}/>
            <div className="button-container-row">
              <button onClick={this.props.handleCode} className="blackButton" id="codeSubmitButton">Submit</button>
              <a href="/" className="blackButton" id="codeHomeLink">Home</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Code;
