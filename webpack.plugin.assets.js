const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Copy the /src/assets folder.
module.exports = new CopyWebpackPlugin([
  {
    from: path.join(__dirname, 'src', 'assets'),
    to: path.join(__dirname, 'build', 'assets'),
  },
]);
