import React from "react";
import "./App.css";
import { getRootDirectory } from "./services";
import Directory from "./Directory";
import File from "./File";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      contents: undefined
    };

    this.toggleExpansion = this.toggleExpansion.bind(this);
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

  render() {
    const { contents } = this.state;
    const { toggleExpansion } = this;

    if (!contents) {
      return "Loading...";
    }

    return (
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
                />
              ) : (
                <File {...obj} key={obj.path} />
              )
            )}
          </td>
        </tr>
      </table>
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
