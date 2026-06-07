#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Push the generated static /en/insights page to DA, then preview + live publish.
 *
 * Usage:
 *   AEM_ADMIN_TOKEN=... node tools/da/push-insights-page.js
 *
 * Auth uses two tokens (which may be the same long-lived service token):
 *   - DA upload (admin.da.live):  DA_TOKEN env, else ~/today-da-token.txt
 *   - hlx publish (admin.hlx.page): AEM_ADMIN_TOKEN env, else ~/today-auth-token.txt
 * These default to the 24h testing tokens on disk; in CI both come from secrets.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ORG = 'treeves';
const SITE = 'opsinventor-eds';
const BRANCH = 'main';
const DA_API = 'https://admin.da.live/source';
const HLX_API = 'https://admin.hlx.page';

const SOURCE_FILE = process.env.INSIGHTS_OUTPUT || 'en/insights.plain.html';
const DA_PATH = process.env.INSIGHTS_DA_PATH || '/en/insights.html';
const HLX_PATH = process.env.INSIGHTS_HLX_PATH || 'en/insights';
const SHOULD_PUBLISH_LIVE = `${process.env.INSIGHTS_PUBLISH_LIVE || 'true'}`.toLowerCase() !== 'false';

function readTokenFile(fileName) {
  const file = path.join(os.homedir(), fileName);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : '';
}

const daToken = process.env.DA_TOKEN || readTokenFile('today-da-token.txt');
const adminToken = process.env.AEM_ADMIN_TOKEN || readTokenFile('today-auth-token.txt');
if (!daToken) {
  console.error('Error: DA_TOKEN env or ~/today-da-token.txt is required (DA upload).');
  process.exit(1);
}
if (!adminToken) {
  console.error('Error: AEM_ADMIN_TOKEN env or ~/today-auth-token.txt is required (hlx publish).');
  process.exit(1);
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../..');

function wrapPlainAsDaDocument(innerHtml) {
  return `<body>\n  <header></header>\n  <main>\n${innerHtml}\n  </main>\n  <footer></footer>\n</body>`;
}

async function upload() {
  const fullSourcePath = path.resolve(repoRoot, SOURCE_FILE);
  if (!fs.existsSync(fullSourcePath)) {
    throw new Error(`Missing source file: ${fullSourcePath}`);
  }

  const plain = fs.readFileSync(fullSourcePath, 'utf8').trim();
  const wrapped = wrapPlainAsDaDocument(plain);

  const form = new FormData();
  form.append('data', new Blob([wrapped], { type: 'text/html' }), path.basename(DA_PATH));

  const url = `${DA_API}/${ORG}/${SITE}${DA_PATH}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${daToken}` },
    body: form,
  });

  if (!response.ok && response.status !== 201) {
    const body = await response.text();
    throw new Error(`DA upload failed (${response.status}): ${body.slice(0, 400)}`);
  }

  console.log(`Uploaded ${DA_PATH} (${response.status}).`);
}

async function hlxAction(action) {
  const url = `${HLX_API}/${action}/${ORG}/${SITE}/${BRANCH}/${HLX_PATH}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'x-auth-token': adminToken },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`${action} failed (${response.status}): ${body.slice(0, 400)}`);
  }

  console.log(`${action} OK (${response.status}).`);
}

async function run() {
  await upload();
  await hlxAction('preview');
  if (SHOULD_PUBLISH_LIVE) {
    await hlxAction('live');
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
