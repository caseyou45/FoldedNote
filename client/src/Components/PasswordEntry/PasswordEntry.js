import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PasswordEntry.scss";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setStateNote } from "../../reducers/noteReducer";

const PasswordEntry = ({ setNeedsAuth }) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let input = location.pathname.split("/").pop();

    try {
      let result = await axios.post(`/api/note/fetch_secure`, {
        identifier: input,
        password: password,
      });
      if (result) {
        dispatch(setStateNote(result.data));
        setNeedsAuth(false);
      }
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const createNew = () => {
    window.location.href = "/";
  };

  return (
    <div className="modal-password">
      <h2>Secured Note</h2>
      <h5>This note is password protected.</h5>
      <p className="error-message">{message}</p>
      <form>
        <input
          type="text"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Enter
        </button>
      </form>
      <button className="cancel" onClick={createNew}>
        Create New Note
      </button>
    </div>
  );
};

export default PasswordEntry;
