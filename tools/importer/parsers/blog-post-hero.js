/* eslint-disable */
/* global WebImporter */

/**
 * Parser for blog-post-hero block
 *
 * Source: https://www.opsinventor.com/replacing-an-ssl-certificate-on-aem-6-5/
 * Base Block: blog-post-hero
 *
 * Block Structure (from markdown):
 * - Row 1: Block name header ("Blog Post Hero")
 * - (No content rows - block is metadata-driven)
 *
 * The blog-post-hero block reads all its content from page metadata
 * (og:title, author, date, image, tags) set via the Metadata block.
 * The parser extracts metadata values from the source DOM and creates
 * both the empty hero block and a Metadata block with extracted values.
 *
 * Source HTML Pattern:
 * <div class="post-XXXX post type-post...">
 *   <div class="news-thumb"><img src="..." title="..." alt="..."></div>
 *   <h1 class="single-title">Title</h1>
 *   <span class="posted-date">April 12, 2023</span>
 *   <span class="author-meta"><span class="author-meta-by">By</span><a>Author</a></span>
 *   <div class="single-content">...</div>
 * </div>
 *
 * Generated: 2026-02-14
 */
export default function parse(element, { document }) {
  // Extract metadata from the source DOM
  // VALIDATED: Selectors extracted from captured DOM (cleaned.html)

  // Extract featured image
  // EXTRACTED: Found <div class="news-thumb"><img src="..." title="..." alt="..."> in captured DOM
  const featuredImg = element.querySelector('.news-thumb img');
  const imageUrl = featuredImg ? (featuredImg.getAttribute('src') || '') : '';

  // Extract title
  // EXTRACTED: Found <h1 class="single-title"> in captured DOM
  const titleEl = element.querySelector('h1.single-title') || element.querySelector('h1');
  const title = titleEl ? titleEl.textContent.trim() : '';

  // Extract date
  // EXTRACTED: Found <span class="posted-date"> in captured DOM
  const dateEl = element.querySelector('.posted-date');
  const dateText = dateEl ? dateEl.textContent.trim() : '';

  // Extract author
  // EXTRACTED: Found <span class="author-meta"><a>Tad Reeves</a> in captured DOM
  const authorEl = element.querySelector('.author-meta a');
  const author = authorEl ? authorEl.textContent.trim() : '';

  // Extract category from entry-footer
  // EXTRACTED: Found <div class="cat-links"><a>technology</a> in captured DOM
  const catEl = element.querySelector('.cat-links a');
  const tags = catEl ? catEl.textContent.trim() : '';

  // Create the blog-post-hero block (empty - metadata-driven)
  const heroCells = [];
  const heroBlock = WebImporter.Blocks.createBlock(document, {
    name: 'Blog Post Hero',
    cells: heroCells,
  });

  // Create the Metadata block with extracted values
  const metaCells = [];
  if (title) metaCells.push(['title', title]);
  if (title) metaCells.push(['og:title', title]);
  if (author) metaCells.push(['author', author]);
  if (dateText) metaCells.push(['date', dateText]);
  if (imageUrl) metaCells.push(['image', imageUrl]);
  if (tags) metaCells.push(['tags', tags]);

  const metaBlock = WebImporter.Blocks.createBlock(document, {
    name: 'Metadata',
    cells: metaCells,
  });

  // Create a container with hero block, then append metadata at document end
  const container = document.createElement('div');
  container.append(heroBlock);

  // Append metadata block to the end of the main content
  const main = document.querySelector('main') || document.body;
  main.append(metaBlock);

  // Replace the original element with the hero block
  element.replaceWith(container);
}
