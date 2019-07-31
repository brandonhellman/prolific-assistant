const fs = require('fs-extra');
const path = require('path');
const commandLineArgs = require('command-line-args');
const JSZip = require('jszip');

const readdirSyncRecursive = require('./readdirSyncRecursive');

const buildFilePaths = readdirSyncRecursive('build').map((o) => o.path);
const optionDefinitions = [{ name: 'targets', alias: 't', type: String, multiple: true, defaultOption: true }];
const options = commandLineArgs(optionDefinitions);
const package = fs.readJsonSync('./package.json');

fs.ensureDirSync('dist');

options.targets.forEach((target) => {
  const zip = new JSZip();
  const zipName = `${target}-${package.version}`;
  const zipPath = `dist/${zipName}.zip`;

  fs.removeSync(zipPath);

  if (target === 'chrome') {
    buildFilePaths.forEach((filePath) => {
      const parsed = path.parse(filePath);
      const dirs = parsed.dir.split(path.sep).filter((dir) => dir !== 'build');
      zip.folder(zipName).file(path.join(...dirs, parsed.base), fs.readFileSync(filePath));
    });
  } else if (target === 'firefox') {
    buildFilePaths.forEach((filePath) => {
      const parsed = path.parse(filePath);
      const dirs = parsed.dir.split(path.sep).filter((dir) => dir !== 'build');
      zip.file(path.join(...dirs, parsed.base), fs.readFileSync(filePath));
    });
  }

  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
    .pipe(fs.createWriteStream(zipPath))
    .on('finish', () => console.log(`${zipPath} created.`));
});

const sourceFilePaths = readdirSyncRecursive('.').map((o) => o.path);
const sourceZip = new JSZip();
const sourceZipName = `source-${package.version}`;
const sourceZipPath = `dist/${sourceZipName}.zip`;

fs.removeSync(sourceZipPath);

sourceFilePaths.forEach((filePath) => {
  const pathsToSkip = ['.git', 'build', 'dist', 'node_modules'];

  if (pathsToSkip.some((path) => filePath.startsWith(path))) {
    return;
  }

  sourceZip.file(filePath, fs.readFileSync(filePath));
});

sourceZip
  .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
  .pipe(fs.createWriteStream(sourceZipPath))
  .on('finish', () => console.log(`${sourceZipPath} created.`));
