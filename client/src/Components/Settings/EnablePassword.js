import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStateNote } from "../../reducers/noteReducer";
import { useSelector } from "react-redux";
import axios from "axios";

const EnablePassword = ({ setNoteProtected, setShowSettingsModal }) => {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [message, setMessage] = useState("");

  const [passwordSt, setpasswordSt] = useState({
    length: false,
    match: false,
  });

  const dispatch = useDispatch();

  const note = useSelector((state) => state.note);

  const enablePassword = async (password) => {
    note.password = password;
    try {
      let returnedNote = await axios.post("/api/note/password/enable", note);
      if (returnedNote) {
        setMessage("Password Set");
        setPassword("");
        setPasswordCheck("");
        dispatch(setStateNote(returnedNote.data));
        setTimeout(() => {
          setShowSettingsModal(false);
          setNoteProtected(true);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const passwordStrength = (pwd) => {
    // LengthCheck
    if (pwd.length >= 8 && passwordSt.length === false) {
      setpasswordSt((prevState) => ({
        ...prevState,
        length: true,
      }));
    }
    if (pwd.length < 8 && passwordSt.length === true) {
      setpasswordSt((prevState) => ({
        ...prevState,
        length: false,
      }));
    }

    // Match Check
    if (password === passwordCheck && passwordSt.match === false) {
      setpasswordSt((prevState) => ({
        ...prevState,
        match: true,
      }));
    }
    if (password !== passwordCheck && passwordSt.match === true) {
      setpasswordSt((prevState) => ({
        ...prevState,
        match: false,
      }));
    }
  };

  const checkForSubmit = () => {
    let checkList = Object.values(passwordSt);
    let checkBool = checkList.every(Boolean);
    if (checkBool) {
      return true;
    } else return false;
  };

  const handleSecureClick = (e) => {
    e.preventDefault();
    if (checkForSubmit()) {
      enablePassword(password);
    }
  };

  useEffect(() => {
    passwordStrength(password);
  });

  return (
    <div>
      <h2>Protect with Password</h2>
      <h5>
        The contents of this note will be password protected. No account
        required.
      </h5>
      <p className="message">{message}</p>
      <form className="enable-password">
        <label>Password</label>
        <input
          type="text"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <p>
          <i
            style={{ color: passwordSt.length ? "#06d6a0" : "#ef476f" }}
            className={
              passwordSt.length ? "lni lni-checkmark-circle" : "lni lni-warning"
            }
          ></i>
          At Least 8 Characters
        </p>
        <label>Retype Password</label>
        <input
          type="text"
          name="passwordCheck"
          value={passwordCheck}
          onChange={(e) => {
            setPasswordCheck(e.target.value);
          }}
        ></input>
        <p>
          <i
            style={{
              color:
                passwordSt.match && passwordSt.length ? "#06d6a0" : "#ef476f",
            }}
            className={
              passwordSt.length ? "lni lni-checkmark-circle" : "lni lni-warning"
            }
          ></i>
          Passwords Must Match
        </p>
        <button
          onClick={(e) => {
            handleSecureClick(e);
          }}
        >
          Secure
        </button>
      </form>
    </div>
  );
};

export default EnablePassword;
