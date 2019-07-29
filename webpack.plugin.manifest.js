const fs = require('fs-extra');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const package = fs.readJsonSync('./package.json');

// Copies the manifest.json file and merges properties from the package.json file.
module.exports = new CopyWebpackPlugin([
  {
    from: path.join(__dirname, 'src', 'manifest.json'),
    to: path.join(__dirname, 'build', 'manifest.json'),
    transform(content) {
      // Convert buffer to string and remove comments.
      const string = content.toString().replace(/^(\s+)?\/\/.+/gm, '');

      // Merge the manifest built from package.json and the manifest.json file.
      const manifest = {
        author: package.author,
        description: package.description,
        manifest_version: 2,
        name: package.productName || package.name,
        version: package.version,
        ...JSON.parse(string),
      };

      // Add a default_title to the browser_action if none is defined.
      if (manifest.browser_action && !manifest.browser_action.default_title) {
        manifest.browser_action.default_title = package.name;
      }

      return JSON.stringify(manifest, null, 2);
    },
  },
]);
