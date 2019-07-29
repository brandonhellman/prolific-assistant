const readdirSyncRecursive = require('./readdirSyncRecursive');

// Create an entry for every .ts and .tsx file in the src/pages folder.
const pages = readdirSyncRecursive('src/pages').reduce((acc, file) => {
  if (file.name.match(/ts(x?)/)) {
    return {
      ...acc,
      [file.name.split('.')[0]]: file.fullPath,
    };
  }

  return acc;
}, {});

// Create an entry for every .ts file in the src/content_scripts folder.
const content_scripts = readdirSyncRecursive('src/content_scripts').reduce((acc, file) => {
  if (file.name.match(/\.ts$/)) {
    return {
      ...acc,
      ['content_scripts/' + file.name.split('.')[0]]: file.fullPath,
    };
  }
}, {});

module.exports = { ...pages, ...content_scripts };
