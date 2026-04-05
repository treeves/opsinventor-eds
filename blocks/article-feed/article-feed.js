/**
 * Article Feed block — fetches posts from the query index and renders cards.
 *
 * Configuration via block content:
 * - Row 1: query index path (e.g. /en/query-index.json)
 * - Row 2 (optional): limit (default 10)
 *
 * The locale-specific index path makes this block reusable across locales:
 *   /en/query-index.json, /de/query-index.json, etc.
 */

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function createCard(article, featured = false) {
  const card = document.createElement('article');
  card.className = featured ? 'feed-card feed-card-featured' : 'feed-card';

  const link = document.createElement('a');
  link.href = article.path;
  link.className = 'feed-card-link';

  if (article.image) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'feed-card-image';
    const img = document.createElement('img');
    img.src = article.image;
    img.alt = article.title || '';
    img.loading = 'lazy';
    imgWrap.append(img);
    link.append(imgWrap);
  }

  const content = document.createElement('div');
  content.className = 'feed-card-content';

  if (article.tags) {
    const tags = document.createElement('div');
    tags.className = 'feed-card-tags';
    tags.textContent = article.tags;
    content.append(tags);
  }

  const title = document.createElement('h3');
  title.textContent = article.title || '';
  content.append(title);

  const meta = document.createElement('div');
  meta.className = 'feed-card-meta';
  const parts = [];
  if (article.date) parts.push(formatDate(article.date));
  if (article.author) parts.push(article.author);
  meta.textContent = parts.join(' · ');
  content.append(meta);

  if (article.description) {
    const desc = document.createElement('p');
    desc.className = 'feed-card-description';
    desc.textContent = article.description;
    content.append(desc);
  }

  link.append(content);
  card.append(link);
  return card;
}

export default async function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const indexPath = rows[0]?.textContent?.trim() || '/en/query-index.json';
  const limit = parseInt(rows[1]?.textContent?.trim(), 10) || 0;

  el.innerHTML = '';

  try {
    const resp = await fetch(indexPath);
    if (!resp.ok) throw new Error(`Failed to fetch ${indexPath}`);
    const json = await resp.json();

    let articles = json.data || [];

    // Filter out pages (only blog posts) and the index page itself
    articles = articles.filter((a) => a.pagetype !== 'page' && !a.path.endsWith('/index'));

    // Sort by date descending (newest first)
    articles.sort((a, b) => {
      const da = new Date(a.date || 0);
      const db = new Date(b.date || 0);
      return db - da;
    });

    if (limit > 0) articles = articles.slice(0, limit);

    if (articles.length === 0) {
      el.textContent = 'No articles found.';
      return;
    }

    // Featured section: top 5
    const featured = articles.slice(0, 5);
    const rest = articles.slice(5);

    const featuredSection = document.createElement('div');
    featuredSection.className = 'feed-featured';
    featured.forEach((a) => featuredSection.append(createCard(a, true)));
    el.append(featuredSection);

    // Remaining articles
    if (rest.length > 0) {
      const listSection = document.createElement('div');
      listSection.className = 'feed-list';
      rest.forEach((a) => listSection.append(createCard(a)));
      el.append(listSection);
    }
  } catch (e) {
    el.textContent = 'Unable to load articles.';
  }
}
