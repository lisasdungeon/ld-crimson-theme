import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const manifestPath = path.join(root, 'module.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;
const releaseName = `ld-crimson-theme-v${version}.zip`;
const releasePath = path.join(root, 'backups', releaseName);
const latestZipPath = path.join(root, 'ld-crimson-theme.zip');

fs.mkdirSync(path.join(root, 'backups'), { recursive: true });
execFileSync(process.execPath, [path.join(root, 'scripts', 'validate.mjs')], { stdio: 'inherit' });
execFileSync('npm', ['run', 'build:dist'], { stdio: 'inherit', shell: true });

if (fs.existsSync(releasePath)) fs.rmSync(releasePath, { force: true });
if (fs.existsSync(latestZipPath)) fs.rmSync(latestZipPath, { force: true });

const releaseItems = [
	'assets',
	'common',
	'dist',
	'lang',
	'styles',
	'LICENSE',
	'README.md',
	'CHANGELOG.md',
	'module.json'
].map((item) => path.join(root, item));

execFileSync(
	'powershell',
	[
		'-NoProfile',
		'-Command',
		`Compress-Archive -Path ${releaseItems.map((item) => `'${item}'`).join(', ')} -DestinationPath '${latestZipPath}' -Force`
	],
	{ stdio: 'inherit' }
);

fs.copyFileSync(latestZipPath, releasePath);

console.log(`Created ${releasePath}`);
