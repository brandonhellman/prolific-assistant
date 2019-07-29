const fs = require('fs-extra');
const path = require('path');

module.exports = function readdirSyncRecursive(directory) {
  const paths = fs
    .readdirSync(directory)
    .map((fileName) => ({
      fullPath: path.join(__dirname, directory, fileName),
      name: fileName,
      path: path.join(directory, fileName),
    }));
  const files = paths.filter((path) => fs.statSync(path.path).isFile());
  const directoryPaths = paths.filter((path) => fs.statSync(path.path).isDirectory());
  const directoryFiles = directoryPaths.reduce((acc, path) => [...acc, ...readdirSyncRecursive(path.path)], []);
  return [...files, ...directoryFiles];
};
