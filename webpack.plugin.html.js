const fs = require('fs-extra');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Create a HTML page for every html file in the /src/pages folder.
module.exports = fs.readdirSync('./src/pages').reduce((acc, fileName) => {
  const [name, ext] = fileName.split('.');

  if (ext && ext.match(/html/)) {
    return [
      ...acc,
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'pages', fileName),
        filename: name + '.html',
        chunks: [name],
      }),
    ];
  }

  return acc;
}, []);
