/* Speaking — YouTube card grid. Each authored row is one card:
   | event label | title | youtube url |

   The site has a `youtube` auto-linkBlock that swaps youtube anchors for
   `<div class="video">` BEFORE this decorator runs, so we resolve the URL
   from either the original anchor (when present) or the auto-block's data-src. */

function videoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    if (u.pathname.includes('/embed/')) {
      return decodeURIComponent(u.pathname.split('/embed/').pop());
    }
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch (e) {
    return '';
  }
}

function resolveUrl(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a[href]');
  if (a) return a.getAttribute('href');
  const video = cell.querySelector('.video');
  if (video?.dataset?.src) return video.dataset.src;
  return cell.textContent.trim();
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'speaking-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const event = (cells[0]?.textContent || '').trim();
    const title = (cells[1]?.textContent || '').trim();
    const url = resolveUrl(cells[2]);
    if (!url) return;

    const id = videoId(url);
    const watchUrl = id ? `https://www.youtube.com/watch?v=${id}` : url;
    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';

    const card = document.createElement('a');
    card.className = 'speaking-card';
    card.href = watchUrl;
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML = `
      <div class="speaking-thumb">
        ${thumb ? `<img src="${thumb}" alt="" loading="lazy">` : ''}
      </div>
      <div class="speaking-body">
        <div class="speaking-event">${event}</div>
        <div class="speaking-title">${title}</div>
        <span class="speaking-link">Watch on YouTube →</span>
      </div>
    `;
    grid.appendChild(card);
  });

  block.innerHTML = '';
  block.appendChild(grid);

  const section = block.closest('.section');
  if (section) section.classList.add('speaking-section');
}
