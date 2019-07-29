# web-extension-template

## Installation

1. Clone the repo `git clone https://github.com/Kadauchi/web-extension-template`
2. Run `npm i`

## Development

1. Run `npm run build`
2. Load the `/build` directory into the browser.

## Distribution

1. Run `npm run dist` to create production ready zip files.
2. Upload `/dist/{browser}-{version}.zip` to the extension store.

## Scripts

#### `npm run build`

Build the extension into the `/build` directory.

#### `npm run clean`

Delete the `/build` and `/dist` directories.

#### `npm run clean:build`

Delete the `/build` directory.

#### `npm run clean:dist`

Delete the `/dist` directory.

#### `npm run dist`

Build the extension into a packed folder `/dist/{browser}-{version}.zip` for Chrome and Firefox that is ready to be uploaded.

#### `npm run dist:chrome`

Build the extension into a packed folder `/dist/chrome-{version}.zip` for Chrome that is ready to be uploaded.

#### `npm run dist:firefox`

Build the extension into a packed folder `/dist/firefox-{version}.zip` for Firefox that is ready to be uploaded.
