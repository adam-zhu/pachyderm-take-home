import React from "react";

const FileModal = ({ data, closeHandler }) => {
  const { path, contents } = data;

  return (
    <div className="modal overlay">
      <div className="inner">
        <div className="content">
          <button onClick={e => closeHandler()}>x</button>
          <h2>{path}</h2>
          <p>{contents ? contents : "Loading..."}</p>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
