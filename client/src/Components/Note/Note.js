import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import DeleteMessage from "./DeleteMessage";
import SettingsModal from "../Settings/SettingsModal";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import buttonTypes from "../../Styling";
import "./Note.scss";

const Note = () => {
  const [status, setStatus] = useState("Saved ");
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState(1500);
  const [showButtons, setShowButtons] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSucess] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const note = useSelector((state) => state.note);
  // const editorRef = useRef(null);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const handleSyleButtonCommand = (event, label) => {
    event.preventDefault();
    const nextState = RichUtils.toggleInlineStyle(editorState, label);
    setEditorState(nextState);
  };

  const handleBlockButtonCommand = (event, style) => {
    event.preventDefault();
    const nextState = RichUtils.toggleBlockType(editorState, style);
    setEditorState(nextState);
  };

  const BlockButtons = ({ label, style }) => {
    return (
      <span
        className="style-buttons"
        onMouseDown={(e) => handleBlockButtonCommand(e, style)}
      >
        {label}
      </span>
    );
  };

  const StyleButtons = ({ style, icon }) => {
    const inlineStyle = editorState.getCurrentInlineStyle();
    const styleSelected = inlineStyle.has(style);
    return (
      <span
        className={"style-buttons " + (styleSelected && "selected-button")}
        onMouseDown={(e) => handleSyleButtonCommand(e, style)}
      >
        <i className={icon}></i>
      </span>
    );
  };

  // Checks for note in redux.
  // If blank note is found, it is created.
  //  Otherwies, notes with existing content are rendered.

  useEffect(() => {
    if (note) {
      if (note.note !== "") {
        const content = convertFromRaw(JSON.parse(note.note));
        setEditorState(EditorState.createWithContent(content));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [note]);

  //  Handles the timing of auto-save
  useEffect(() => {
    if (saving) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 100);
      }, 100);

      if (time === 0) {
        setSaving(false);
        setStatus("Saved ");
      }

      return () => {
        clearInterval(timer);
      };
    }
  });

  // Handles saving process
  const triggerSave = async () => {
    if (!deleteSuccess) {
      try {
        await saveNote();
        if (!saving) {
          setStatus("Saving...");
          setSaving(true);
        }
        setTime(1500);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Key is pressed. Save is Made.

  const saveNote = async () => {
    const contentState = editorState.getCurrentContent();
    note.note = convertToRaw(contentState);
    const rawDraftContentState = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    note.note = rawDraftContentState;

    let savedNote = await axios.post("/api/note/save", note);
    if (savedNote) {
      return true;
    }
  };

  const toggleStyleButtons = () => {
    setShowButtons(!showButtons);
  };

  const trackKeyDown = (e) => {
    triggerSave();
  };

  const deleteNote = async (e) => {
    try {
      let result = await axios.post("/api/note/delete", {
        _id: note._id,
      });

      if (result) {
        setDeleteSucess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteConfirmComponent = () => {
    return (
      <div className="delete">
        <button disabled={deleteSuccess} onClick={deleteNote}>
          Delete Note
        </button>
        <button
          disabled={deleteSuccess}
          onClick={() => setConfirmDelete(false)}
        >
          Cancel Delete
        </button>
      </div>
    );
  };

  return (
    <div className="wrapper">
      <div className="dashboard">
        <div className="info">
          {!confirmDelete ? (
            <div>
              <span style={{ color: saving ? "#ef476f" : "#118ab2" }}>
                {status}
                {!saving && <i class="lni lni-checkmark-circle"></i>}
              </span>
            </div>
          ) : (
            <div></div>
          )}
          {!confirmDelete ? (
            <div>
              <button onClick={() => setShowSettingsModal(!showSettingsModal)}>
                <i className="lni lni-lock"></i> Manage Security
              </button>
              <button onClick={() => setConfirmDelete(true)}>
                <i className="lni lni-trash-can"></i>
              </button>
            </div>
          ) : (
            <DeleteConfirmComponent />
          )}
        </div>
        <div className={showButtons ? "buttons-display " : "truncate"}>
          <span className="style-buttons" onClick={triggerSave}>
            <i className="lni lni-save"></i>
          </span>
          {buttonTypes.INLINE_STYLES.map(({ style, icon }) => (
            <StyleButtons style={style} icon={icon} />
          ))}
          {buttonTypes.BLOCK_TYPES.map(({ style, label }) => (
            <BlockButtons style={style} label={label} />
          ))}
        </div>
        <button className="show-more" onClick={toggleStyleButtons}>
          <i
            className={
              showButtons ? "lni lni-chevron-up" : "lni lni-chevron-down"
            }
          ></i>
        </button>
      </div>
      <div className="main" onKeyDown={(e) => trackKeyDown(e)}>
        {!deleteSuccess ? (
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        ) : (
          <DeleteMessage />
        )}
      </div>
      <SettingsModal
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
      />
    </div>
  );
};

export default Note;
