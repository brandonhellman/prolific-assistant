const fs = require('fs-extra');
const path = require('path');
const commandLineArgs = require('command-line-args');
const JSZip = require('jszip');

const readdirSyncRecursive = require('./readdirSyncRecursive');

const buildFilePaths = readdirSyncRecursive('build').map((o) => o.path);
const srcFilePaths = readdirSyncRecursive('src').map((o) => o.path);
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

    const srcZip = new JSZip();
    const srcZipName = `firefox-source-${package.version}`;
    const srcZipPath = `dist/${srcZipName}.zip`;

    fs.removeSync(srcZipPath);

    srcFilePaths.forEach((filePath) => {
      const parsed = path.parse(filePath);
      const dirs = parsed.dir.split(path.sep).filter((dir) => dir !== 'src');
      srcZip.file(path.join(...dirs, parsed.base), fs.readFileSync(filePath));
    });

    srcZip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
    .pipe(fs.createWriteStream(srcZipPath))
    .on('finish', () => console.log(`${srcZipPath} created.`));
  }

  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
    .pipe(fs.createWriteStream(zipPath))
    .on('finish', () => console.log(`${zipPath} created.`));
});
