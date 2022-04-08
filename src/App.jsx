import React from "react";
import { useEffect, useState } from "react";
import "./App.scss";
import io from "socket.io-client";

let username = prompt("What is your username");

const usernameValidation = () => {
  if (username?.length > 16) {
    username = prompt("use max 16 characters");
    usernameValidation();
  } else if (username === null || username?.length === 0) {
    username = prompt("Please try again");
    usernameValidation();
  }
};
usernameValidation();

const socket = io("https://chat-its.herokuapp.com", {
  transports: ["websocket", "polling"],
});

const App = ({}) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("username", username);
    });

    socket.on("users", (users) => {
      setUsers(users);
      console.log("users working");
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
      console.log("message working");
    });

    socket.on("connected", (user) => {
      setUsers((users) => [...users, user]);
      console.log("connected working");
    });

    socket.on("disconnected", (id) => {
      setUsers((users) => {
        return users.filter((user) => user.id !== id);
      });
      console.log("disconnected working");
    });
  }, []);

  const submit = (event) => {
    event.preventDefault();
    socket.emit("send", message);
    setMessage("");
  };

  return (
    <div className="container">
      <div className="header">
        <header>Wake up, {username}...</header>
      </div>
      <div className="wrap">
        <div className="messages">
          <div className="content">
            {messages.map(({ user, text }, index) => (
              <div key={index} className="text-row">
                <div className="user-name">{user ? `<${user?.name}>` : ""}</div>
                <div className={user ? "user-message" : "user-notification"}>{text}</div>
                <div className="user-name">{user ? `</${user?.name}>` : ""}</div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} id="form">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setMessage(e.currentTarget.value)}
              value={message}
              id="text"
              autoFocus
              autoComplete="off"
            />
          </form>
        </div>
        <div className="users">
          <div className="title">Online</div>
          <ul>
            {users.map(({ name, id }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
