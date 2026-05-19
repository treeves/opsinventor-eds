/* Home Hero — ink/orange split with crossfade carousel + Rapid Drop panel.
   Authored as a near-empty block; content is intentionally baked in here so
   the home page stays a one-line author surface and visual updates happen
   via code review. Authors can override slide URLs by adding rows of the
   form: | slide | https://… | */

const SLIDES = [
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1544191696-15693072e0b5?auto=format&fit=crop&w=1600&h=900&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&h=900&q=80',
];

const CHIPS = [
  { label: 'Adobe AEM Champion' },
  { label: 'Featured Speaker', alt: true },
  { label: 'Principal Architect' },
  { label: '15+ Years', alt: true },
];

const PLATFORMS = ['YouTube', 'Instagram', 'LinkedIn', 'TikTok'];

function readAuthoredSlides(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const slideRows = rows
    .map((r) => r.textContent.trim())
    .filter((t) => /^https?:\/\//.test(t));
  return slideRows.length ? slideRows : SLIDES;
}

export default function decorate(block) {
  const slides = readAuthoredSlides(block);
  block.innerHTML = '';

  const left = document.createElement('div');
  left.className = 'home-hero-left';

  const stage = document.createElement('div');
  stage.className = 'home-hero-stage';
  stage.setAttribute('aria-hidden', 'true');
  slides.forEach((src, i) => {
    const s = document.createElement('div');
    s.className = 'home-hero-slide';
    s.style.backgroundImage = `url('${src}')`;
    s.style.animationDelay = `${i * 6}s`;
    stage.appendChild(s);
  });
  left.appendChild(stage);

  const dots = document.createElement('div');
  dots.className = 'home-hero-dots';
  dots.setAttribute('aria-hidden', 'true');
  slides.forEach((_, i) => {
    const d = document.createElement('span');
    if (i === 0) d.classList.add('on');
    dots.appendChild(d);
  });
  left.appendChild(dots);

  left.insertAdjacentHTML('beforeend', `
    <div class="home-hero-kicker">// AEM Champion · Principal Architect · 15+ Years</div>
    <h1 class="home-hero-h1">Tad<br>Reeves.</h1>
    <p class="home-hero-dek">I architect Adobe Experience Manager systems that actually hold up — through Edge Delivery rollouts, 6.5 LTS migrations, AEMaaCS cutovers, and the gnarly edge cases nobody warned you about.</p>
    <div class="home-hero-chips">
      ${CHIPS.map((c) => `<span class="home-hero-chip${c.alt ? ' home-hero-chip--alt' : ''}">${c.label}</span>`).join('')}
    </div>
    <div class="home-hero-ctas">
      <a class="home-hero-btn home-hero-btn--primary" href="#contact">Bring me a hard problem →</a>
      <a class="home-hero-btn home-hero-btn--ghost" href="#insights">Read the work</a>
    </div>
  `);

  const right = document.createElement('div');
  right.className = 'home-hero-right';
  right.id = 'rapid-drop';
  right.innerHTML = `
    <div class="home-hero-drop-badge">// Launching Soon</div>
    <h2 class="home-hero-drop-title">The Rapid Drop.</h2>
    <p class="home-hero-drop-dek">60-second AEM and martech term definitions. One concept, one drop, one hard truth — syndicated across every channel you actually use.</p>
    <div class="home-hero-drop-platforms">
      ${PLATFORMS.map((p) => `<span>${p}</span>`).join('')}
    </div>
    <form class="home-hero-drop-form" novalidate>
      <input type="email" placeholder="you@company.com" aria-label="Email">
      <button type="submit">Notify me</button>
    </form>
  `;

  // Styled placeholder: no real submit.
  right.querySelector('form').addEventListener('submit', (e) => e.preventDefault());

  block.appendChild(left);
  block.appendChild(right);

  // Section opts in to full-bleed via the home-template CSS hooks.
  const section = block.closest('.section');
  if (section) section.classList.add('home-hero-section');
}
