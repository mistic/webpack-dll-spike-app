const path = require('path');
const BASE_DIR = path.join(__dirname, '../');

const PATHS = {
  baseDir: BASE_DIR,
  src: path.join(BASE_DIR, 'src'),
  code: path.join(BASE_DIR, 'src/code'),
  build: path.join(BASE_DIR, 'build'),
  dlls: path.join(BASE_DIR, 'build/dlls'),
  assets: path.join(BASE_DIR, 'src/assets'),
  styles: path.join(BASE_DIR, 'src/styles'),
  codeEntry: path.join(BASE_DIR, 'src/code/index.tsx'),
  stylesEntry: path.join(BASE_DIR, 'src/styles/app.scss'),
  htmlTemplate: path.join(BASE_DIR, 'src/index.ejs'),
  pkg: path.join(BASE_DIR, 'package.json')
};

module.exports = {
  PATHS
};
