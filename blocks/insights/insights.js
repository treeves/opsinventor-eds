/* Insights — dark 3-up article cards, dynamically loaded from the query index.

   Defaults: 9 cards initially, 9 more per "More Articles" click.
   Sort: by `date` descending.

   Optional authored config (first row, single cell): query index path.
   If absent, defaults to /en/query-index.json.
*/

const DEFAULT_INDEX = '/opsinventor-en.json';
const PAGE_SIZE = 9;

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
        first = raw.replace(/^\[|\]$/g, '').split(',')[0];
      }
    } else {
      [first] = raw.split(',');
    }
    first = first.replace(/^["\s]+|["\s]+$/g, '');
  }
  return first ? `// ${first}` : '// Field Notes';
}

function buildCard(article) {
  const card = document.createElement('a');
  card.className = 'insights-card';
  card.href = article.path;

  const tag = document.createElement('div');
  tag.className = 'insights-tag';
  tag.textContent = deriveTag(article);

  const title = document.createElement('h3');
  title.className = 'insights-title';
  title.textContent = article.title || article.path;

  const dek = document.createElement('p');
  dek.className = 'insights-dek';
  dek.textContent = article.description || '';

  const link = document.createElement('span');
  link.className = 'insights-link';
  link.textContent = 'Read more →';

  card.append(tag, title, dek, link);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const configCell = rows[0]?.querySelector(':scope > div');
  const configText = (configCell?.textContent || '').trim();
  const indexPath = configText && configText.startsWith('/') ? configText : DEFAULT_INDEX;

  // Promote the section to the dark band styling immediately so the layout is stable
  const section = block.closest('.section');
  if (section) section.classList.add('insights-section');

  block.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'insights-grid';
  block.appendChild(grid);

  const moreWrap = document.createElement('div');
  moreWrap.className = 'insights-more-wrap';
  const moreBtn = document.createElement('button');
  moreBtn.type = 'button';
  moreBtn.className = 'insights-more';
  moreBtn.textContent = 'More Articles →';
  moreWrap.appendChild(moreBtn);
  block.appendChild(moreWrap);

  let articles = [];
  let cursor = 0;

  function renderNext() {
    const slice = articles.slice(cursor, cursor + PAGE_SIZE);
    slice.forEach((a) => grid.appendChild(buildCard(a)));
    cursor += slice.length;
    if (cursor >= articles.length) moreWrap.style.display = 'none';
  }

  try {
    const resp = await fetch(indexPath);
    if (!resp.ok) throw new Error(`Failed to fetch ${indexPath} (${resp.status})`);
    const json = await resp.json();
    articles = (json.data || [])
      .filter((a) => a.path
        && !a.path.endsWith('/index')
        && !a.redirectTarget
        && (!a.template || a.template === 'blog'))
      .sort((a, b) => {
        const da = Number(a.date) || new Date(a.date || 0).getTime() || 0;
        const db = Number(b.date) || new Date(b.date || 0).getTime() || 0;
        return db - da;
      });
  } catch (e) {
    const err = document.createElement('p');
    err.className = 'insights-error';
    err.textContent = 'Unable to load articles.';
    block.insertBefore(err, moreWrap);
    moreWrap.style.display = 'none';
    return;
  }

  if (articles.length === 0) {
    moreWrap.style.display = 'none';
    return;
  }

  renderNext();
  moreBtn.addEventListener('click', renderNext);
}
