#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Push the generated static /en/insights page to DA, then preview + live publish.
 *
 * Usage:
 *   AEM_ADMIN_TOKEN=... node tools/da/push-insights-page.js
 *
 * Auth: a single long-lived AEM Admin Service token authorizes both the DA
 * upload and the hlx publish. Resolution order: AEM_ADMIN_TOKEN env, DA_TOKEN
 * env, first CLI arg, then ~/today-da-token.txt (local dev).
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

const defaultTokenFile = path.join(os.homedir(), 'today-da-token.txt');
const tokenFromFile = fs.existsSync(defaultTokenFile)
  ? fs.readFileSync(defaultTokenFile, 'utf8').trim()
  : '';
const token = process.env.AEM_ADMIN_TOKEN
  || process.env.DA_TOKEN || process.argv[2] || tokenFromFile;
if (!token) {
  console.error('Error: AEM_ADMIN_TOKEN, DA_TOKEN, first arg, or ~/today-da-token.txt is required.');
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
    headers: { Authorization: `Bearer ${token}` },
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
    headers: { Authorization: `Bearer ${token}` },
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
