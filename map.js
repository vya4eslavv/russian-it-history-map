const MAP_SVG_SELECTOR = '#svg-ussr';
const REGION_API_BASE = '/api/regions';
const IMAGE_SRC = '/images/final/'

// ===== helpers =====
function getRegionKey(pathEl) {
  const dt = pathEl.dataset?.title;
  if (dt && dt.trim()) return dt.trim();

  if (pathEl.dataset?.region && pathEl.dataset.region.trim()) return pathEl.dataset.region.trim();
  if (pathEl.id && pathEl.id.trim()) return pathEl.id.trim();

  const t = pathEl.getAttribute('title') || pathEl.getAttribute('aria-label');
  if (t && t.trim()) return t.trim();

  return null;
}

function getRegionCode(pathEl) {
  const code = pathEl.dataset?.code;
  return code && code.trim() ? code.trim() : null;
}

function assignFallbackKeys(svg) {
  const paths = Array.from(svg.querySelectorAll('path'));
  paths.forEach((p, i) => {
    if (!getRegionKey(p)) {
      p.dataset.region = `region-${i + 1}`;
    }
    p.style.cursor = 'pointer';
  });
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showRegionPreview(previewSvg, originalPath) {
  clearNode(previewSvg);

  const clone = originalPath.cloneNode(true);
  clone.style.cursor = 'default';

  const tf = originalPath.getAttribute('transform');
  if (tf) clone.setAttribute('transform', tf);

  previewSvg.appendChild(clone);

  const bb = clone.getBBox();
  const pad = Math.max(10, Math.min(bb.width, bb.height) * 0.12);
  const x = bb.x - pad;
  const y = bb.y - pad;
  const w = bb.width + pad * 2;
  const h = bb.height + pad * 2;

  previewSvg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);

  const computed = getComputedStyle(originalPath);
  clone.style.fill = computed.fill && computed.fill !== 'none' ? computed.fill : '#047dff';
  clone.style.stroke = '#fff';
  clone.style.strokeWidth = '2';
  clone.style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,.35))';
}

function highlightSelected(svg, selectedPath) {
  svg.querySelectorAll('path').forEach((p) => {
    p.style.strokeWidth = '';
    p.style.stroke = '';
    p.style.filter = '';
  });

  selectedPath.style.stroke = '#fff';
  selectedPath.style.strokeWidth = '2.5';
  selectedPath.style.filter = 'drop-shadow(0 10px 16px rgba(0,0,0,.35))';
  selectedPath.parentNode.appendChild(selectedPath);
}

async function fetchRegionAchievements(regionCode) {
  const response = await fetch(
    `${REGION_API_BASE}/${encodeURIComponent(regionCode)}/achievements`,
    { method: 'GET' }
  );

  console.log(response)

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}${text ? `: ${text}` : ''}`);
  }

  return response.json();
}

function renderLoadingAchievements(container) {
  container.innerHTML = `
    <div class="achievement">
      Загружаю достижения...
    </div>
  `;
}

function renderAchievementsError(container, message) {
  container.innerHTML = `
    <div class="achievement">
      Не удалось загрузить достижения.
      <div style="margin-top:8px;opacity:.75;">${escapeHtml(message || 'Неизвестная ошибка')}</div>
    </div>
  `;
}

function renderAchievements(container, achievements = []) {
  if (!achievements.length) {
    container.innerHTML = `
      <div class="achievement">
        Пока нет данных по достижениям для этой области.
      </div>
    `;
    return;
  }

  container.innerHTML = achievements
    .map((a) => {
      return `
        <article class="achievement" data-id="${a.id}">
          <div class="top">
            <div class="achievement-title" style="font-weight:700"></div>
            <div class="year"></div>
          </div>

          <div class="achievement-meta" style="margin:6px 0 10px; font-size:13px; opacity:.75;"></div>

          <div class="achievement-description" style="opacity:.9; line-height:1.45;"></div>
        </article>
      `;
    })
    .join('');

  const cards = container.querySelectorAll('.achievement');

  cards.forEach((card, index) => {
    const item = achievements[index];

    const titleNode = card.querySelector('.achievement-title');
    const yearNode = card.querySelector('.year');
    const metaNode = card.querySelector('.achievement-meta');
    const descNode = card.querySelector('.achievement-description');

    const titleText = item.name || item.title || 'Без названия';
    const yearText = item.period_text || item.period || '';
    const metaText = [item.location_name, item.inventor].filter(Boolean).join(' • ');
    const descText = item.description || '';

    if (titleNode) typeText(titleNode, titleText, 10);
    if (yearNode) typeText(yearNode, yearText, 20);
    if (metaNode) typeText(metaNode, metaText, 20);
    if (descNode) typeText(descNode, descText, 20);

    card.addEventListener('click', () => {
      openAchievementModal(item);
    });
  });
}
// ===== init =====
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector(MAP_SVG_SELECTOR);
  if (!svg) {
    console.error('Map SVG not found. Set MAP_SVG_SELECTOR to your map svg.');
    return;
  }

  assignFallbackKeys(svg);
  if (typeof setupRegionHoverLabel === 'function') {
    setupRegionHoverLabel(svg);
  }

  const titleEl = document.getElementById('regionTitle');
  const descEl = document.getElementById('regionDesc');
  const achEl = document.getElementById('regionAchievements');
  const previewSvg = document.getElementById('regionPreviewSvg');

  if (!titleEl || !descEl || !achEl || !previewSvg) {
    console.error('Region UI containers not found.');
    return;
  }

  const cache = new Map();

  svg.addEventListener('click', async (e) => {
    const path = e.target.closest?.('path');
    if (!path || !svg.contains(path)) return;

    const regionName = getRegionKey(path) || 'Неизвестная область';
    const regionCode = getRegionCode(path);

    highlightSelected(svg, path);
    showRegionPreview(previewSvg, path);

    titleEl.textContent = regionName;
    descEl.textContent = '';
    renderLoadingAchievements(achEl);

    if (!regionCode) {
      renderAchievementsError(achEl, 'У области отсутствует data-code.');
      return;
    }

    try {
      let payload;

      if (cache.has(regionCode)) {
        payload = cache.get(regionCode);
      } else {
        payload = await fetchRegionAchievements(regionCode);
        console.log(payload)
        console.log(payload)
        cache.set(regionCode, payload);
      }

      titleEl.textContent = payload?.region?.name || regionName;
      descEl.textContent = payload?.region?.description || '';

      renderAchievements(achEl, payload?.inventions || []);
    } catch (error) {
      console.error(error);
      renderAchievementsError(achEl, error.message);
    }
  });
});


//прочтение достижения подробнее
function openAchievementModal(item) {
    const modal = document.getElementById('achievementModal');
    const body = document.getElementById('achievementModalBody');

    body.innerHTML = `
        <h2 id="modalAchievementTitle" style="margin-top:0"></h2>

        ${
            item.image_url
                ? `
                <div style="margin:16px 0;">
                    <img
                        src="${escapeHtml( IMAGE_SRC + item.image_url)}"
                        alt="${escapeHtml(item.image_alt || item.name || item.title || '')}"
                        style="width:100%;border-radius:12px;"
                    />
                    ${
                        item.image_caption
                            ? `<div style="margin-top:6px;font-size:12px;opacity:.7;">${escapeHtml(item.image_caption)}</div>`
                            : ''
                    }
                </div>
                `
                : ''
        }

        <div id="modalAchievementMeta" style="opacity:.8;margin-bottom:12px;"></div>
        <div id="modalAchievementDescription" style="line-height:1.6;"></div>
    `;

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    const titleEl = document.getElementById('modalAchievementTitle');
    const metaEl = document.getElementById('modalAchievementMeta');
    const descEl = document.getElementById('modalAchievementDescription');

    const titleText = item.name || item.title || 'Без названия';
    const metaText = [item.location_name, item.inventor, item.period_text || item.period]
        .filter(Boolean)
        .join(' • ');
    const descText = item.full_description || '';

    if (typeof typeText === 'function') {
        typeText(titleEl, titleText, 60).then(() => {
            if (metaText) {
                return typeText(metaEl, metaText, 40);
            }
        });

        descEl.textContent = descText;
    } else {
        titleEl.textContent = titleText;
        metaEl.textContent = metaText;
        descEl.textContent = descText;
    }
}

function setupModal() {
    const modal = document.getElementById('achievementModal');

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    modal.addEventListener('click', (e) => {
        if (
            e.target.classList.contains('achievement-modal-backdrop') ||
            e.target.dataset.action === 'close-modal'
        ) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', setupModal);