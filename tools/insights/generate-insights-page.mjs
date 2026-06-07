#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Generate a static, crawlable /en/insights page from the query index.
 *
 * The live insights block renders client-side (fetch + innerHTML), so crawlers
 * and LLMs see no articles. This emits the same cards as static HTML so the
 * content is present in the raw page before any JS runs. The published markup
 * reuses the `insights` block, which detects pre-rendered cards and skips its
 * fetch (see blocks/insights/insights.js).
 *
 * Usage:
 *   node tools/insights/generate-insights-page.mjs
 *
 * Env:
 *   INSIGHTS_INDEX_URL   query index URL (default production opsinventor-en.json)
 *   INSIGHTS_OUTPUT      output plain.html path (default en/insights.plain.html)
 *   INSIGHTS_EYEBROW     eyebrow text (default "// Insights")
 *   INSIGHTS_HEADING     heading text (default "Field Notes")
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dateValue } from '../../scripts/utils/date.js';

const DEFAULT_INDEX_URL = 'https://www.opsinventor.com/opsinventor-en.json';

const indexUrl = process.env.INSIGHTS_INDEX_URL || DEFAULT_INDEX_URL;
const outputPath = process.env.INSIGHTS_OUTPUT || 'en/insights.plain.html';
const eyebrow = process.env.INSIGHTS_EYEBROW || '// Insights';
const heading = process.env.INSIGHTS_HEADING || 'Field Notes';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../..');

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Mirrors deriveTag() in blocks/insights/insights.js (text variant).
function deriveTag(article) {
  if (article.category && article.category.trim()) return `// ${article.category.trim()}`;
  const t = article.tags;
  let first = '';
  if (Array.isArray(t)) {
    [first = ''] = t;
  } else if (typeof t === 'string' && t.trim()) {
    const raw = t.trim();
    if (raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) [first] = parsed;
      } catch {
        [first] = raw.replace(/^\[|\]$/g, '').split(',');
      }
    } else {
      [first] = raw.split(',');
    }
    first = first.replace(/^["\s]+|["\s]+$/g, '');
  }
  return first ? `// ${first}` : '// Field Notes';
}

// Mirrors the filter in blocks/insights/insights.js.
function isArticle(a) {
  return a.path
    && !a.path.endsWith('/index')
    && !a.redirectTarget
    && (!a.template || a.template === 'blog');
}

function buildCard(article) {
  const tag = escapeHtml(deriveTag(article));
  const title = escapeHtml(article.title || article.path);
  const dek = escapeHtml(article.description || '');
  const href = escapeHtml(article.path);
  return [
    `      <a class="insights-card" href="${href}">`,
    '        <div class="insights-card-body">',
    `          <div class="insights-tag">${tag}</div>`,
    `          <h3 class="insights-title">${title}</h3>`,
    `          <p class="insights-dek">${dek}</p>`,
    '          <span class="insights-link">Read more →</span>',
    '        </div>',
    '      </a>',
  ].join('\n');
}

function buildPlainHtml(articles) {
  const cards = articles.map(buildCard).join('\n');
  return [
    '<div>',
    `  <p>${escapeHtml(eyebrow)}</p>`,
    `  <h2>${escapeHtml(heading)}</h2>`,
    '  <div class="insights">',
    '    <div class="insights-grid insights-grid-text">',
    cards,
    '    </div>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');
}

async function run() {
  const response = await fetch(indexUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch index ${indexUrl} (${response.status})`);
  }
  const json = await response.json();

  const articles = (json.data || [])
    .filter(isArticle)
    .sort((a, b) => dateValue(b.date) - dateValue(a.date));

  if (articles.length === 0) {
    throw new Error('No articles found in index — refusing to publish an empty page.');
  }

  const html = buildPlainHtml(articles);
  const fullOutput = path.resolve(repoRoot, outputPath);
  await fs.mkdir(path.dirname(fullOutput), { recursive: true });
  await fs.writeFile(fullOutput, html, 'utf8');

  console.log(`Generated ${articles.length} insights cards.`);
  console.log(`Output: ${outputPath}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
