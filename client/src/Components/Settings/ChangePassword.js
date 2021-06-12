import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setStateNote } from "../../reducers/noteReducer";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");

  const [passwordSt, setpasswordSt] = useState({
    length: false,
    match: false,
  });

  const dispatch = useDispatch();

  const note = useSelector((state) => state.note);

  const changePassword = async () => {
    let updatedNote = {
      newPassword: newPassword,
      currentPassword: currentPassword,
      identifier: note.identifier,
    };

    try {
      let returnedNote = await axios.post(
        "/api/note/password/change",
        updatedNote
      );
      if (returnedNote) {
        setMessage("Password Changed");
        dispatch(setStateNote(returnedNote.data));
        setNewPassword("");
        setNewPasswordCheck("");
        setCurrentPassword("");
      }
    } catch (error) {
      setMessage(error.response.data.error);
      setCurrentPassword("");
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
    if (newPassword === newPasswordCheck && passwordSt.match === false) {
      setpasswordSt((prevState) => ({
        ...prevState,
        match: true,
      }));
    }
    if (newPassword !== newPasswordCheck && passwordSt.match === true) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkForSubmit()) {
      changePassword();
    }
  };

  useEffect(() => {
    passwordStrength(newPassword);
  });

  return (
    <div>
      <p className="message">{message}</p>
      <form className="change-password">
        <label>Create New Password</label>
        <div>
          <input
            type="text"
            name="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          ></input>
          <p>
            <i
              style={{ color: passwordSt.length ? "#06d6a0" : "#ef476f" }}
              className={
                passwordSt.length
                  ? "lni lni-checkmark-circle"
                  : "lni lni-warning"
              }
            ></i>
            At Least 8 Characters
          </p>
          <label>Retype New Password</label>
          <input
            type="text"
            name="passwordCheck"
            value={newPasswordCheck}
            onChange={(e) => {
              setNewPasswordCheck(e.target.value);
            }}
          ></input>
          <p>
            <i
              style={{
                color:
                  passwordSt.match && passwordSt.length ? "#06d6a0" : "#ef476f",
              }}
              className={
                passwordSt.length
                  ? "lni lni-checkmark-circle"
                  : "lni lni-warning"
              }
            ></i>
            Passwords Must Match
          </p>
        </div>
        <div>
          <label>Current Password</label>
          <input
            type="text"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
            }}
          ></input>
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
