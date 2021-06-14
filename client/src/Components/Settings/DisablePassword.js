import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setStateNote } from "../../reducers/noteReducer";
import { useSelector } from "react-redux";

const DisablePassword = ({ setShowSettingsModal, setNoteProtected }) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const note = useSelector((state) => state.note);

  // Disables password, shows message and triggers modal close.
  const disablePassword = async () => {
    try {
      let returnedNote = await axios.post("/api/note/password/disable", {
        password: password,
        identifier: note.identifier,
      });

      if (returnedNote) {
        dispatch(setStateNote(returnedNote.data));
        setPassword("");
        setMessage("Password Disabled");
        setTimeout(() => {
          setShowSettingsModal(false);
          setNoteProtected(false);
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response.data.error);
      setPassword("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    disablePassword();
  };

  return (
    <div>
      <p className="message">{message}</p>
      <form className="disable-password">
        <label>Enter Current Password</label>
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
          Disable Password
        </button>
      </form>
    </div>
  );
};

export default DisablePassword;
