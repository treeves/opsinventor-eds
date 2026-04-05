#!/usr/bin/env node
/**
 * Downloads featured images from WordPress and uploads them to DA.
 * Updates the .da.html file to reference the DA-hosted image path.
 *
 * Usage: node upload-images-to-da.js <da-html-file> <da-token>
 *
 * Example:
 *   node upload-images-to-da.js content/en/my-post.da.html <token>
 *
 * The script:
 * 1. Reads the .da.html file
 * 2. Finds the image URL in the Metadata table
 * 3. Downloads the image
 * 4. Uploads it to DA at the same path as the document
 * 5. Updates the .da.html with the DA media reference
 * 6. Re-uploads the updated HTML to DA
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const daHtmlFile = process.argv[2];
const daToken = process.argv[3];

const ORG = 'treeves';
const SITE = 'opsinventor-eds';

if (!daHtmlFile || !daToken) {
  console.error('Usage: node upload-images-to-da.js <da-html-file> <da-token>');
  process.exit(1);
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const contentType = res.headers['content-type'] || 'image/png';
        resolve({ buffer: Buffer.concat(chunks), contentType });
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToDA(daPath, buffer, contentType) {
  const url = `https://admin.da.live/source/${ORG}/${SITE}${daPath}`;

  // Build multipart form data manually
  const boundary = `----FormBoundary${crypto.randomBytes(8).toString('hex')}`;
  const filename = path.basename(daPath);

  const header = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="data"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`
  );
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([header, buffer, footer]);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${daToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DA upload failed (${response.status}): ${text}`);
  }
  return response.json();
}

async function main() {
  let html = fs.readFileSync(daHtmlFile, 'utf8');

  // Find image URL in metadata table: <tr><td>image</td><td>URL</td></tr>
  const imageMatch = html.match(/<tr><td>image<\/td><td>([^<]+)<\/td><\/tr>/);
  if (!imageMatch) {
    console.log('No image metadata found, skipping.');
    process.exit(0);
  }

  const imageUrl = imageMatch[1].replace(/&amp;/g, '&');
  console.log(`Found image: ${imageUrl}`);

  // Determine the DA document path from the filename
  // e.g. content/en/my-post.da.html -> /en/my-post
  const relPath = daHtmlFile
    .replace(/^content/, '')
    .replace(/\.da\.html$/, '')
    .replace(/\.plain\.html$/, '');

  // Download the image
  console.log('Downloading image...');
  const { buffer, contentType } = await downloadImage(imageUrl);

  // Determine extension from content type
  const extMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
  };
  const ext = extMap[contentType] || '.png';
  const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 16);
  const mediaFilename = `media_${hash}${ext}`;

  // Upload image to DA at document path
  const daImagePath = `${relPath}/${mediaFilename}`;
  console.log(`Uploading to DA: ${daImagePath}`);
  await uploadToDA(daImagePath, buffer, contentType);
  console.log('  ✓ Image uploaded');

  // Update HTML: replace the image URL with the DA media reference
  const daMediaRef = `./${mediaFilename}`;
  html = html.replace(imageMatch[1], daMediaRef);
  fs.writeFileSync(daHtmlFile, html);
  console.log(`  ✓ Updated ${daHtmlFile} with DA image ref: ${daMediaRef}`);

  // Re-upload the updated HTML to DA
  console.log('Re-uploading HTML to DA...');
  const htmlBuffer = Buffer.from(html, 'utf8');
  await uploadToDA(`${relPath}.html`, htmlBuffer, 'text/html');
  console.log('  ✓ HTML re-uploaded');

  console.log('Done!');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
