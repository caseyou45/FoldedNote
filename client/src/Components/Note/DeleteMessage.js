import React from "react";

const DeleteMessage = () => {
  // Note deleted message with option for creating new Note

  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="delete-message">
      <h4>Note successfully deleted</h4>
      <button onClick={handleClick}>Make New Note</button>
    </div>
  );
};

export default DeleteMessage;
