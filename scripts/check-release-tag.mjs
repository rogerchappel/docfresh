import { readFile } from 'node:fs/promises';

const tag = process.argv[2];

if (!tag) {
  console.error('Release tag is required.');
  process.exit(1);
}

if (!/^v\d+\.\d+\.\d+$/.test(tag)) {
  console.error(`Release tag "${tag}" must use the stable vMAJOR.MINOR.PATCH format.`);
  process.exit(1);
}

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const expectedTag = `v${packageJson.version}`;

if (tag !== expectedTag) {
  console.error(`Release tag "${tag}" does not match package version ${packageJson.version} (${expectedTag}).`);
  process.exit(1);
}

console.log(`Release tag ${tag} matches package version ${packageJson.version}.`);
