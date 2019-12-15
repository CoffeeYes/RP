import React, { Component } from 'react';

class UserList extends Component {

  componentDidMount() {
    this.props.getUsers();
  }
  render() {
    return (
      <div className="horcent">
        <div className="horcent userListContainer">
          <ul>
          {this.props.list.map((item,index) => {
            return (
              <form key={index} className="userListItem" method="post" action="/deleteUser">
                <input className="userListText" value={item.displayname} name="displayname"/>
                <div className="overlayBlock">
                  <input className="userListText" value={"username: " + item.username} name="username"/>
                  <input className="userListText" value={"password: " + item.clearTextPassword} name="password"/>
                </div>
                <button type="submit" className="deleteUserBtn" onClick={this.props.deleteUser} value={item.username}>X</button>
              </form>
            )
          })}
          </ul>
        </div>
      </div>
    );
  }
}

export default UserList;
