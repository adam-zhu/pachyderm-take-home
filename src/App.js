import React from "react";
import "./App.css";
import { getRootDirectory, getFile } from "./services";
import Directory from "./Directory";
import File from "./File";
import FileModal from "./FileModal";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      contents: undefined,
      openedFile: undefined
    };

    this.toggleExpansion = this.toggleExpansion.bind(this);
    this.openFile = this.openFile.bind(this);
    this.closeFile = this.closeFile.bind(this);
  }

  async componentDidMount() {
    const filesystemData = await getRootDirectory();

    this.setState({
      contents: attachExpansionStates(filesystemData)
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

  render() {
    const { contents, openedFile } = this.state;
    const { toggleExpansion, openFile, closeFile } = this;

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
                    expansionToggleHandler={toggleExpansion}
                    openFileHandler={openFile}
                  />
                ) : (
                  <File {...obj} key={obj.path} openFileHandler={openFile} />
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
