import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const modulePath = path.join(root, 'module.json');
const packagePath = path.join(root, 'package.json');
const langPath = path.join(root, 'lang', 'en.json');
const distPath = path.join(root, 'dist', 'ld-crimson-theme.js');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

for (const required of [modulePath, packagePath, langPath]) {
  if (!fs.existsSync(required)) fail(`Missing required file: ${path.relative(root, required)}`);
}

const manifest = readJson(modulePath);
const pkg = readJson(packagePath);
const lang = readJson(langPath);

if (manifest.version !== pkg.version) {
  fail(`Version mismatch: module.json=${manifest.version}, package.json=${pkg.version}`);
}

if (manifest.compatibility?.minimum !== 13 || manifest.compatibility?.verified !== 14) {
  fail('Manifest compatibility must be pinned to Foundry 13 minimum and verified 14');
}

if (manifest.id !== 'ld-crimson-theme') {
  fail(`Unexpected module id: ${manifest.id}`);
}

if (!manifest.styles?.includes('styles/ld-crimson-theme.css')) {
  fail('Manifest styles must include styles/ld-crimson-theme.css');
}

if (!manifest.esmodules?.includes('dist/ld-crimson-theme.js')) {
  fail('Manifest esmodules must include dist/ld-crimson-theme.js');
}

for (const key of [
  'RNKCT.Settings.EnableRandomBackgrounds.Name',
  'RNKCT.Settings.EnableRandomBackgrounds.Hint',
  'RNKCT.PauseText'
]) {
  if (!lang[key]) fail(`Missing localization key: ${key}`);
}

if (!fs.existsSync(distPath)) {
  console.warn('dist/ld-crimson-theme.js is missing. Run npm run build to create it.');
}

console.log('crimson-theme validation passed');
