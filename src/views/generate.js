import React, { Component } from 'react';

class Generate extends Component {

  render() {
    return (
      <div className="horizontal-center">
        <form className="generateForm">
          <input name="codeOutput" value={this.props.generatedCode}/>
          <button onClick={this.props.createCode}>Generate</button>
        </form>
      </div>
    );
  }
}

export default Generate;
