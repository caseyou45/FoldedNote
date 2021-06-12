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
  const [deleted, setDeleted] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const makeIdentifier = (length) => {
    let result = [];
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  };

  const checkURLForUserInput = () => {
    // Checks if user has inputed a full url. If so, it's validated. If not, a new note is craeted.
    let input = location.pathname.split("/").pop();
    if (input) {
      if (input === "delete") {
      } else {
        loadExisitngNote(input);
      }
    } else {
      makeNewNote();
    }
  };

  const fetchNote = async (identifier) => {
    // Checks and possibly gets note saved in Mongo
    try {
      let result = await axios.get(`/api/note/${identifier}`);
      return result.data;
    } catch (error) {
      return error;
    }
  };

  const loadExisitngNote = async (identifier) => {
    // Attempts to load user's input. If validation fails, a new note is created.
    try {
      let result = await axios.get(`/api/note/${identifier}`);
      if (result.data === "none") {
        makeNewNote();
      } else {
        dispatch(setStateNote(result.data));
        setLoad(true);
        history.push(`/${identifier}`);
      }
    } catch (error) {
      if (error.response.status) {
        if (error.response.status === 403) {
          setNeedsAuth(true);
          setLoad(true);
        }
      }
    }
  };

  const makeNewNote = async () => {
    // Makes a new note with random identifier. If random/new identifier is already in use, process
    // is repeated.
    try {
      let randomIdentifier = makeIdentifier(10);

      let result = await fetchNote(randomIdentifier);

      if (result !== "none") {
        makeNewNote();
      } else {
        let result = await axios.post(`/api/note`, {
          identifier: randomIdentifier,
        });
        dispatch(setStateNote(result.data));
        setLoad(true);
        history.push(`/${randomIdentifier}`);
      }
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
