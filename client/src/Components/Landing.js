import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStateNote } from "../reducers/noteReducer";
import Note from "./Note/Note";
import PasswordEntry from "./PasswordEntry/PasswordEntry";

const Landing = () => {
  const [needsAuth, setNeedsAuth] = useState(false);
  const [load, setLoad] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const makeIdentifier = (length) => {
    const result = [];
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  };

  const checkURLForUserInput = () => {
    // Checks if user has inputed a full url. If so, it's validated. If not, a new note is craeted.
    const input = location.pathname.split("/").pop();
    if (input) {
      if (input === "delete") {
      } else {
        loadExisitngNote(input);
      }
    } else {
      makeNewNote();
    }
  };

  const loadExisitngNote = async (identifier) => {
    // Attempts to load user's input. If validation fails, a new note is created.
    try {
      const result = await axios.get(`/api/note/${identifier}`);
      dispatch(setStateNote(result.data));
      setLoad(true);
      history.push(`/${identifier}`);
    } catch (error) {
      if (error.response.status) {
        //Note has been found but it is password protected
        if (error.response.status === 401) {
          setNeedsAuth(true);
          setLoad(true);
          //There is no note with that URL, so make a new one
        } else if (error.response.status === 404) {
          makeNewNote();
        }
      }
    }
  };

  const makeNewNote = async () => {
    // Makes a new note with random identifier
    try {
      const randomIdentifier = makeIdentifier(10);

      const result = await axios.post(`/api/note`, {
        identifier: randomIdentifier,
      });

      dispatch(setStateNote(result.data));
      setLoad(true);
      history.push(`/${randomIdentifier}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkURLForUserInput();
  }, []);

  return (
    <div>
      {load && (
        <div>
          {needsAuth ? (
            <PasswordEntry needsAuth={needsAuth} setNeedsAuth={setNeedsAuth} />
          ) : (
            <Note />
          )}
        </div>
      )}
    </div>
  );
};

export default Landing;
