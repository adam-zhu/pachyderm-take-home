import React from "react";

const File = ({
  name,
  path,
  atime,
  mtime,
  grabbedFile,
  openFileHandler,
  fileGrabHandler
}) => {
  return (
    <tr
      className={`file ${
        grabbedFile && grabbedFile.path === path ? "grabbed" : ""
      }`}
      onClick={e => openFileHandler(path)}
      draggable
      onDragStart={e => fileGrabHandler({ path, name })}
      onDragEnd={e => fileGrabHandler(undefined)}
    >
      <td>{name}</td>
      <td>{path}</td>
      <td>
        <em>atime</em> {new Date(atime).toLocaleString()}
      </td>
      <td>
        <em>mtime</em> {new Date(mtime).toLocaleString()}
      </td>
    </tr>
  );
};

export default File;
