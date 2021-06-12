import React, { useState, useEffect } from "react";
import EnablePassword from "./EnablePassword";
import DisablePassword from "./DisablePassword";

import ChangePassword from "./ChangePassword";

import "./Settings.scss";
import { useSelector } from "react-redux";

const SettingsModal = ({ setShowSettingsModal, showSettingsModal }) => {
  const [showChange, setShowChange] = useState(true);
  const [noteProtected, setNoteProtected] = useState(false);

  const note = useSelector((state) => state.note);

  useEffect(() => {
    setNoteProtected(note.protected);
  }, []);

  const offClick = ({ target }) => {
    if (showSettingsModal === true && target.className === "modal-background")
      setShowSettingsModal(false);
  };

  return (
    <div
      class="modal-background"
      style={{ display: showSettingsModal ? "block" : "none" }}
      onClick={(e) => offClick(e)}
    >
      <div className="modal-settings">
        <div>
          {noteProtected ? (
            <div>
              <div className="selection-settings">
                <button
                  style={{ backgroundColor: showChange && "#166079" }}
                  name="change"
                  onClick={(e) => setShowChange(true)}
                >
                  Change Password
                </button>
                <button
                  style={{ backgroundColor: !showChange && "#166079" }}
                  name="disable"
                  onClick={(e) => setShowChange(false)}
                >
                  Disable Password
                </button>
              </div>
              <div>
                {showChange ? (
                  <ChangePassword setNoteProtected={setNoteProtected} />
                ) : (
                  <DisablePassword
                    setShowSettingsModal={setShowSettingsModal}
                    setNoteProtected={setNoteProtected}
                  />
                )}
              </div>{" "}
            </div>
          ) : (
            <EnablePassword
              setShowSettingsModal={setShowSettingsModal}
              setNoteProtected={setNoteProtected}
            />
          )}
        </div>
        <button
          className="cancel"
          onClick={() => {
            setShowSettingsModal(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
