import React, { useState } from "react";
import "./Auth.scss";
import { useNavigate } from "react-router-dom";

const Auth = ({ setUsername, setIsAuth }) => {
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const input = React.createRef();
  const navigate = useNavigate();

  const usernameValidation = (value) => {
    if (value?.length > 16) {
      setError("use max 16 characters");
      setIsValid(false);
    } else if (value === null || value?.trim().length === 0) {
      setError("Please try again");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  };

  const submitAuth = (event) => {
    event.preventDefault();
    const value = event.target[0].value;

    if (isValid) {
      setUsername(value);
      setIsAuth(true);
      navigate("/main");
    }
  };

  const changeAuth = (event) => {
    usernameValidation(event.target.value);
  };

  const returnFocus = () => {
    input?.current?.focus();
  };

  return (
    <div className="auth">
      <div className="auth__window">
        <h2 className="mb-5">Matrix has you</h2>
        <form onSubmit={submitAuth}>
          <h5 className="mb-4 auth__lable">What is your nickname?</h5>
          <input
            className="auth__input mb-4"
            type="text"
            autoComplete="false"
            spellCheck="false"
            autoFocus
            ref={input}
            onBlur={returnFocus}
            onChange={changeAuth}
          ></input>
          <h5>{error}</h5>
        </form>
      </div>
    </div>
  );
};
export default Auth;
