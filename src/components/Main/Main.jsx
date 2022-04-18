import React, { useEffect, useState, useRef } from "react";
import "./Main.scss";
import io from "socket.io-client";
import FreeScrollBar from "react-free-scrollbar";

// const socket = io("http://localhost:3001", {
//   transports: ["websocket", "polling"],
// });

const socket = io("https://chat-its.herokuapp.com", {
  transports: ["websocket", "polling"],
});

const Main = ({ username }) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const input = React.createRef();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit("username", username);

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

  const returnFocus = () => {
    input?.current?.focus();
  };

  return (
    <div className="contain">
      <header className="header">
        <div className="header__title">Wake up, {username}...</div>
        <div className="header__online">Online</div>
      </header>
      <div className="wrap">
        <div className="messages">
          <FreeScrollBar>
            <div className="content">
              {messages.map(({ user, text }, index) => (
                <div key={index} className="content__text-row">
                  <div className="content__user-name">{user ? `<${user?.name}>` : ""}</div>
                  <div className={user ? "content__user-message" : "content__user-notification"}>{text}</div>
                  <div className="content__user-name">{user ? `</${user?.name}>` : ""}</div>
                </div>
              ))}
            </div>
            <form onSubmit={submit} ref={messagesEndRef}>
              <input
                type="text"
                className="user-input"
                value={message}
                autoFocus
                autoComplete="false"
                spellCheck="false"
                ref={input}
                onChange={(e) => setMessage(e.currentTarget.value)}
                onBlur={returnFocus}
              />
            </form>
          </FreeScrollBar>
        </div>
        <div className="users">
          <FreeScrollBar>
            <ul>
              {users.map(({ name, id }) => (
                <li key={id}>{name}</li>
              ))}
            </ul>
          </FreeScrollBar>
        </div>
      </div>
    </div>
  );
};
export default Main;
