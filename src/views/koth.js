import React, { Component } from 'react';

class Koth extends Component {

  render() {
    return (
      <div className="cam-container">
        <div className="cam-row">
          <div className="cam guest">
            <p>name1</p>
          </div>
          <div className="cam guest">
            <p>name2</p>
          </div>
        </div>
        <div className="cam-row">
          <div className="cam guest">
            <p>name3</p>
          </div>
          <div className="cam guest">
            <p>name4</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Koth;
