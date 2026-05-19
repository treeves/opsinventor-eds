/* Ticker — animated mono marquee. Author content with one paragraph of items
   separated by " | ". Defaults applied when block is empty. */

const DEFAULT_ITEMS = [
  'AEM Champion',
  '15+ Years',
  'Featured Speaker',
  'Edge Delivery',
  'AEM 6.5 LTS',
  'AEMaaCS',
  'Hard Problems Welcome',
  'Mountain Biker',
];

function readItems(block) {
  const text = block.textContent.trim();
  if (!text) return DEFAULT_ITEMS;
  return text.split(/\s*[|·]\s*/).filter(Boolean);
}

export default function decorate(block) {
  const items = readItems(block);
  block.innerHTML = '';

  const track = document.createElement('div');
  track.className = 'ticker-track';

  // Duplicate the items twice so the -50% translate animation loops seamlessly.
  for (let copy = 0; copy < 2; copy += 1) {
    const span = document.createElement('span');
    span.innerHTML = items
      .map((it) => `<em class="ticker-item">${it}</em><em class="ticker-dot" aria-hidden="true">●</em>`)
      .join('');
    track.appendChild(span);
  }

  block.appendChild(track);

  const section = block.closest('.section');
  if (section) section.classList.add('ticker-section');
}
