import React, { Component } from 'react';

class addUser extends Component {

  render() {
    return (
      <div className="horcent">
        <form className="addUserForm">
          <p className="error">{this.props.error}</p>
          <label>Username</label>
          <input name="username" className="addUserInput" onChange={this.props.update}/>
          <label>Password</label>
          <input name="password" className="addUserInput" onChange={this.props.update}/>
          <label>Display Name</label>
          <input name="displayname" className="addUserInput" onChange={this.props.update}/>
          <button onClick={this.props.addUser} id="addUserBtn">Add</button>
        </form>
      </div>
    );
  }
}

export default addUser;
