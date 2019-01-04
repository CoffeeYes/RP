import React, { Component } from 'react';

class addUser extends Component {

  render() {
    return (
      <div className="horcent">
        <form className="addUserForm">
          <label>Username</label>
          <input name="username"/>
          <label>Password</label>
          <input name="password"/>
          <label>Display Name</label>
          <input name="displayname"/>
          <button>Add</button>
        </form>
      </div>
    );
  }
}

export default addUser;
