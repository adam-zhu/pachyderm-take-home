import React from "react";
import "./App.css";
import { getRootDirectory, getFile, moveFile } from "./services";
import Directory from "./Directory";
import File from "./File";
import FileModal from "./FileModal";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      contents: undefined,
      openedFile: undefined,
      grabbedFile: undefined,
      hoveredDropTarget: undefined
    };

    this.toggleExpansion = this.toggleExpansion.bind(this);
    this.openFile = this.openFile.bind(this);
    this.closeFile = this.closeFile.bind(this);
    this.setGrabbedFile = this.setGrabbedFile.bind(this);
    this.setHoveredDropTarget = this.setHoveredDropTarget.bind(this);
    this.doMoveFile = this.doMoveFile.bind(this);
  }

  async componentDidMount() {
    const filesystemData = await getRootDirectory();

    this.setState({
      contents: attachExpansionStates(filesystemData)
    });
  }

  toggleExpansion(path) {
    const toggleExpansionState = contents =>
      contents.reduce((acc, c) => {
        if (c.type === "directory") {
          return acc.concat([
            c.path === path
              ? { ...c, expanded: !c.expanded }
              : { ...c, contents: toggleExpansionState(c.contents) }
          ]);
        }

        return acc.concat([c]);
      }, []);

    this.setState({
      contents: toggleExpansionState(this.state.contents, path)
    });
  }

  async openFile(path) {
    this.setState({
      openedFile: {
        contents: undefined,
        path
      }
    });

    const contents = await getFile(path);

    this.setState({
      openedFile: {
        ...this.state.openedFile,
        contents
      }
    });
  }

  closeFile() {
    this.setState({
      openedFile: undefined
    });
  }

  setGrabbedFile(grabbedFile) {
    this.setState({ grabbedFile });
  }

  setHoveredDropTarget(hoveredDropTarget) {
    this.setState({
      hoveredDropTarget
    });
  }

  async doMoveFile() {
    const originalPath = this.state.grabbedFile.path;
    const newPath = `${this.state.hoveredDropTarget}/${
      this.state.grabbedFile.name
    }`;

    await moveFile({ originalPath, newPath });

    const filesystemData = await getRootDirectory();

    this.setState({
      contents: attachExpansionStates(filesystemData)
    });
  }

  render() {
    const { contents, openedFile, grabbedFile, hoveredDropTarget } = this.state;
    const {
      toggleExpansion,
      openFile,
      closeFile,
      setGrabbedFile,
      setHoveredDropTarget,
      doMoveFile
    } = this;

    if (!contents) {
      return "Loading...";
    }

    return (
      <>
        <table>
          <tr>
            <td className="directory-name">/</td>
          </tr>
          <tr className="contents">
            <td>
              {contents.map(obj =>
                obj.type === "directory" ? (
                  <Directory
                    {...obj}
                    key={obj.path}
                    hoveredDropTarget={hoveredDropTarget}
                    grabbedFile={grabbedFile}
                    expansionToggleHandler={toggleExpansion}
                    openFileHandler={openFile}
                    fileGrabHandler={setGrabbedFile}
                    hoverOverHandler={setHoveredDropTarget}
                    dropHandler={doMoveFile}
                  />
                ) : (
                  <File
                    {...obj}
                    key={obj.path}
                    grabbedFile={grabbedFile}
                    openFileHandler={openFile}
                    fileGrabHandler={setGrabbedFile}
                  />
                )
              )}
            </td>
          </tr>
        </table>
        {typeof openedFile !== "undefined" && (
          <FileModal data={openedFile} closeHandler={closeFile} />
        )}
      </>
    );
  }
}

const attachExpansionStates = contents => {
  const expanded = false;

  return contents.map(obj => {
    if (obj.type === "directory") {
      return {
        ...obj,
        expanded,
        contents: attachExpansionStates(obj.contents)
      };
    }

    return obj;
  });
};

export default App;
