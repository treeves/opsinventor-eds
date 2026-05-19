/* Insights — dark 3-up article cards. Each authored row is one card:
   | // Tag | [Title](/url) | Dek | CTA label → | */

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'insights-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const tag = (cells[0]?.textContent || '').trim();
    const titleLink = cells[1]?.querySelector('a');
    const titleText = (titleLink?.textContent || cells[1]?.textContent || '').trim();
    const href = titleLink?.getAttribute('href') || '#';
    const dek = (cells[2]?.textContent || '').trim();
    const cta = (cells[3]?.textContent || 'Read more →').trim();

    if (!titleText) return;

    const card = document.createElement('a');
    card.className = 'insights-card';
    card.href = href;
    card.innerHTML = `
      <div class="insights-tag">${tag}</div>
      <h3 class="insights-title">${titleText}</h3>
      <p class="insights-dek">${dek}</p>
      <span class="insights-link">${cta}</span>
    `;
    grid.appendChild(card);
  });

  block.innerHTML = '';
  block.appendChild(grid);

  const section = block.closest('.section');
  if (section) section.classList.add('insights-section');
}
