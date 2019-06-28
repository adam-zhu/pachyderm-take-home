import React from "react";
import File from "./File";

const Directory = ({
  name,
  path,
  contents,
  expanded,
  hoveredDropTarget,
  grabbedFile,
  expansionToggleHandler,
  openFileHandler,
  fileGrabHandler,
  hoverOverHandler,
  dropHandler
}) => {
  return (
    <table>
      <tr>
        <td
          className={`directory-name expandable ${
            hoveredDropTarget === path ? "hovered" : ""
          }`}
          onClick={e => expansionToggleHandler(path)}
          onDragEnter={e => hoverOverHandler(path)}
          onDragLeave={e => hoverOverHandler(undefined)}
          onDrop={e => dropHandler()}
          onDragOver={e => e.preventDefault()}
        >
          {expanded ? "-" : "+"} {name}
        </td>
      </tr>
      {expanded && (
        <ExpandedBody
          contents={contents}
          hoveredDropTarget={hoveredDropTarget}
          grabbedFile={grabbedFile}
          expansionToggleHandler={expansionToggleHandler}
          openFileHandler={openFileHandler}
          fileGrabHandler={fileGrabHandler}
          hoverOverHandler={hoverOverHandler}
          dropHandler={dropHandler}
        />
      )}
    </table>
  );
};

const ExpandedBody = ({
  contents,
  hoveredDropTarget,
  grabbedFile,
  expansionToggleHandler,
  openFileHandler,
  fileGrabHandler,
  hoverOverHandler,
  dropHandler
}) => (
  <tr className="contents">
    <td>
      {contents.map(c =>
        c.type === "file" ? (
          <File
            {...c}
            grabbedFile={grabbedFile}
            openFileHandler={openFileHandler}
            fileGrabHandler={fileGrabHandler}
          />
        ) : (
          <Directory
            {...c}
            hoveredDropTarget={hoveredDropTarget}
            grabbedFile={grabbedFile}
            expansionToggleHandler={expansionToggleHandler}
            openFileHandler={openFileHandler}
            fileGrabHandler={fileGrabHandler}
            hoverOverHandler={hoverOverHandler}
            dropHandler={dropHandler}
          />
        )
      )}
    </td>
  </tr>
);

export default Directory;
