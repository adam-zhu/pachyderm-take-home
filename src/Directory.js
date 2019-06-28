import React from "react";
import File from "./File";

const Directory = ({
  name,
  path,
  contents,
  expanded,
  expansionToggleHandler,
  openFileHandler
}) => {
  return (
    <table>
      <tr>
        <td
          className="directory-name expandable"
          onClick={e => expansionToggleHandler(path)}
        >
          {expanded ? "-" : "+"} {name}
        </td>
      </tr>
      {expanded && (
        <ExpandedBody
          contents={contents}
          expansionToggleHandler={expansionToggleHandler}
          openFileHandler={openFileHandler}
        />
      )}
    </table>
  );
};

const ExpandedBody = ({
  contents,
  expansionToggleHandler,
  openFileHandler
}) => (
  <tr className="contents">
    <td>
      {contents.map(c =>
        c.type === "file" ? (
          <File {...c} openFileHandler={openFileHandler} />
        ) : (
          <Directory
            {...c}
            expansionToggleHandler={expansionToggleHandler}
            openFileHandler={openFileHandler}
          />
        )
      )}
    </td>
  </tr>
);

export default Directory;
