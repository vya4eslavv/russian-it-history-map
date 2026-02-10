const MAP_SVG_SELECTOR = '#svg-ussr'; // <-- ПОДСТРОЙ: лучше указать конкретный id

// Пример данных: ключ = regionKey, который мы извлечём из path
const DATA = {
  // если у path есть id="spb" → ключ будет "spb"
  spb: {
    title: 'Санкт-Петербург',
    description: 'Крупнейший научно-инженерный центр и сильная школа приборостроения и ИТ.',
    achievements: [
      { year: 1957, title: 'Пример достижения', text: 'Описание достижения, почему важно.' },
      { year: 2020, title: 'Ещё один пункт', text: 'Коротко: команда/изобретение/проект.' },
    ],
  },

  // если у path нет id, будет region-1, region-2, ...
  'region-1': {
    title: 'Регион 1',
    description: 'Заполни данные для region-1',
    achievements: [{ year: 1965, title: 'Демо', text: '...' }],
  },
};

// ===== helpers =====
function getRegionKey(pathEl) {
  // 1) главный источник: data-title
  const dt = pathEl.dataset?.title;
  if (dt && dt.trim()) return dt.trim();

  // 2) запасные варианты (на всякий)
  if (pathEl.dataset?.region && pathEl.dataset.region.trim()) return pathEl.dataset.region.trim();
  if (pathEl.id && pathEl.id.trim()) return pathEl.id.trim();

  const t = pathEl.getAttribute('title') || pathEl.getAttribute('aria-label');
  if (t && t.trim()) return t.trim();

  return null;
}

function assignFallbackKeys(svg) {
  const paths = Array.from(svg.querySelectorAll('path'));
  paths.forEach((p, i) => {
    // если вообще нет идентификатора — создаём стабильный
    if (!getRegionKey(p)) {
      p.dataset.region = `region-${i + 1}`;
    }
    // чтобы было видно, что кликабельно
    p.style.cursor = 'pointer';
  });
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function renderAchievements(container, achievements = []) {
  if (!achievements.length) {
    container.innerHTML = `<div class="achievement">Пока нет данных по достижениям для этой области.</div>`;
    return;
  }

  container.innerHTML = achievements
    .slice()
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
    .map((a) => `
      <div class="achievement">
        <div class="top">
          <div style="font-weight:700">${a.title ?? 'Без названия'}</div>
          <div class="year">${a.year ?? ''}</div>
        </div>
        <div style="opacity:.9;line-height:1.35">${a.text ?? ''}</div>
        ${a.link ? `<div style="margin-top:8px"><a href="${a.link}" target="_blank" rel="noreferrer">Источник</a></div>` : ''}
      </div>
    `)
    .join('');
}

function showRegionPreview(previewSvg, originalPath) {
  clearNode(previewSvg);

  const clone = originalPath.cloneNode(true);

  // делаем клон "чисто визуальным"
  clone.style.cursor = 'default';

  // копируем transform если он был
  const tf = originalPath.getAttribute('transform');
  if (tf) clone.setAttribute('transform', tf);

  previewSvg.appendChild(clone);

  // подстраиваем viewBox под bbox фигуры
  const bb = clone.getBBox();
  const pad = Math.max(10, Math.min(bb.width, bb.height) * 0.12);
  const x = bb.x - pad;
  const y = bb.y - pad;
  const w = bb.width + pad * 2;
  const h = bb.height + pad * 2;

  previewSvg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);

  // стили клона (можешь настроить)
  const computed = getComputedStyle(originalPath);
  clone.style.fill = computed.fill && computed.fill !== 'none' ? computed.fill : '#666';
  clone.style.stroke = '#fff';
  clone.style.strokeWidth = '2';
  clone.style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,.35))';
}

function highlightSelected(svg, selectedPath) {
  // снимем подсветку со всех (без классов)
  svg.querySelectorAll('path').forEach((p) => {
    p.style.strokeWidth = '';
    p.style.stroke = '';
    p.style.filter = '';
  });

  // подсветим выбранный
  selectedPath.style.stroke = '#fff';
  selectedPath.style.strokeWidth = '2.5';
  selectedPath.style.filter = 'drop-shadow(0 10px 16px rgba(0,0,0,.35))';

  // поднять наверх (рисуется последним)
  selectedPath.parentNode.appendChild(selectedPath);
}

// ===== init =====
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector(MAP_SVG_SELECTOR);
  if (!svg) {
    console.error('Map SVG not found. Set MAP_SVG_SELECTOR to your map svg.');
    return;
  }

  assignFallbackKeys(svg);

  const titleEl = document.getElementById('regionTitle');
  const descEl = document.getElementById('regionDesc');
  const achEl = document.getElementById('regionAchievements');
  const previewSvg = document.getElementById('regionPreviewSvg');

  if (!titleEl || !descEl || !achEl || !previewSvg) {
    console.error('Region UI containers not found (regionTitle/regionDesc/regionAchievements/regionPreviewSvg).');
    return;
  }

  svg.addEventListener('click', (e) => {
    const path = e.target.closest?.('path');
    if (!path || !svg.contains(path)) return;

    const regionKey = getRegionKey(path) || path.dataset.region;
    const info = DATA[regionKey];

    highlightSelected(svg, path);
    showRegionPreview(previewSvg, path);

    titleEl.textContent = info?.title || `Область: ${regionKey}`;
    descEl.textContent = info?.description || '';

    renderAchievements(achEl, info?.achievements || []);
  });
});