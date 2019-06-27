import React from "react";
import File from "./File";

const Directory = ({
  name,
  path,
  contents,
  expanded,
  expansionToggleHandler
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
        />
      )}
    </table>
  );
};

const ExpandedBody = ({ contents, expansionToggleHandler }) => (
  <tr className="contents">
    <td>
      {contents.map(c =>
        c.type === "file" ? (
          <File {...c} />
        ) : (
          <Directory {...c} expansionToggleHandler={expansionToggleHandler} />
        )
      )}
    </td>
  </tr>
);

export default Directory;
