import React from "react";

const File = ({ name, path, atime, mtime }) => {
  return (
    <tr className="file">
      <td>{name}</td>
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
