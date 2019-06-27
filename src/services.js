const ROOT = "http://178.128.71.229:8080/pfs/";

const doRequest = async (method, stub) => {
  const response = await fetch(`${ROOT}${stub}`, {
    method,
    mode: "cors",
    cache: "no-cache",
    credentials: "omit"
  });
  const data = await response.json();

  return data;
};

export const getRootDirectory = async () => {
  const responseData = await getDirectoryContents("/");

  return responseData;
};

export const getDirectory = async path => {
  const responseData = await doRequest("GET", `dir${path}`);

  return responseData;
};

export const getFile = async path => {
  const responseData = await doRequest("GET", `file${path}`);

  return responseData;
};

const getDirectoryContents = async path => {
  const { status, data } = await getDirectory(path);
  const { directories, files } = categorize(data);
  const directoriesContent = await Promise.all(
    directories.map(async directory => {
      const contents = await getDirectoryContents(directory.path);

      return {
        ...directory,
        contents
      };
    })
  );

  return directoriesContent.concat(files);
};

const categorize = data =>
  Object.keys(data).reduce(
    (acc, key) => {
      const d = data[key];
      const formatted = {
        ...d,
        name: key
      };

      return d.type === "directory"
        ? { ...acc, directories: acc.directories.concat([formatted]) }
        : { ...acc, files: acc.files.concat([formatted]) };
    },
    { directories: [], files: [] }
  );
