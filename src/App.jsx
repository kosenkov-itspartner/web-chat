import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.scss";
import Auth from "./components/Auth/Auth";
import Main from "./components/Main/Main";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <Routes>
      <Route path="/" element={<Auth setUsername={setUsername} setIsAuth={setIsAuth} />} />
      <Route path="/main" element={isAuth ? <Main username={username} /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
