/* Speaking — YouTube card grid. Each authored row is one card:
   | event label | title | youtube url |
*/

function videoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    // /embed/<id>
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch (e) {
    return '';
  }
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'speaking-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const event = (cells[0]?.textContent || '').trim();
    const title = (cells[1]?.textContent || '').trim();
    const linkEl = cells[2]?.querySelector('a');
    const url = (linkEl?.href || cells[2]?.textContent || '').trim();
    if (!url) return;

    const id = videoId(url);
    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';

    const card = document.createElement('a');
    card.className = 'speaking-card';
    card.href = url;
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
