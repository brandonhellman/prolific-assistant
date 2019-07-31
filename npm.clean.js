const fs = require('fs-extra');
const path = require('path');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [{ name: 'paths', alias: 'p', type: String, multiple: true, defaultOption: true }];
const options = commandLineArgs(optionDefinitions);

options.paths.forEach((p) => {
  fs.remove(path.join(__dirname, p));
});

console.log('Removed paths:', options.paths.join(', '));
