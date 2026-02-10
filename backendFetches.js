const API_BASE = 'http://localhost:8080/api/invention/get';
const INVENTION_IDS = [2, 13, 14, 15, 16, 17, 18, 19];

function ensureElement(id, tagName, parent = document.body) {
  let el = document.getElementById(id);
  if (el) return el;

  el = document.createElement(tagName);
  el.id = id;
  parent.appendChild(el);
  return el;
}

function ensureUiSkeleton() {
  // These elements might be missing from static HTML.
  const tooltip = ensureElement('tooltip', 'div');
  const sidePanel = ensureElement('sidePanel', 'aside');
  const authorPanel = ensureElement('authorPanel', 'aside');

  // Minimal styles (the project may override them via CSS).
  Object.assign(tooltip.style, {
    position: 'fixed',
    zIndex: '9999',
    display: 'none',
    maxWidth: '320px',
    background: 'rgba(20, 20, 20, 0.95)',
    color: '#fff',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  });

  Object.assign(sidePanel.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    height: '100vh',
    width: '360px',
    maxWidth: '92vw',
    overflowY: 'auto',
    background: 'rgba(10, 10, 10, 0.98)',
    color: '#fff',
    zIndex: '9998',
    transform: 'translateX(105%)',
    transition: 'transform 200ms ease',
    padding: '16px',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.35)',
  });

  Object.assign(authorPanel.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    height: '100vh',
    width: '360px',
    maxWidth: '92vw',
    overflowY: 'auto',
    background: 'rgba(10, 10, 10, 0.98)',
    color: '#fff',
    zIndex: '9999',
    transform: 'translateX(105%)',
    transition: 'transform 200ms ease',
    padding: '16px',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.35)',
  });

  return { tooltip, sidePanel, authorPanel };
}

async function fetchJson(url) {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} for ${url}${text ? `: ${text}` : ''}`);
  }
  return res.json();
}

function appendHtml(container, htmlString) {
  const frag = document.createRange().createContextualFragment(htmlString);
  container.appendChild(frag);
}

const AUTHOR_DATA = {
  'Урал-1': {
    title: 'Рамеев Б.И.',
    images: [{ src: 'images/Рамеев_Башир_Искандарович.jpg', alt: 'Рамеев Б.И.' }],
    bio:
      '<strong>Рамеев Б.И.</strong> — советский изобретатель, разработчик первых советских ЭВМ (в т.ч. «Урал-1»). Доктор технических наук (1962), лауреат Сталинской премии (1954).',
  },
  'ЭВМ «Минск»': {
    title: 'Надененко В.К.',
    images: [
      { src: 'images/fdoc836.png', alt: 'Надененко В.К.' },
      { src: 'images/img-seLAsQ.png', alt: 'ИЭТ АН БССР' },
    ],
    bio:
      '<strong>Надененко В.К.</strong> — главный конструктор ЭЦВМ «Минск-22» и один из ключевых разработчиков серии «Минск» (серийное производство 1965–1970).',
  },
  МЭСМ: {
    title: 'Лебедев С.А.',
    images: [{ src: 'images/LEBEDEV.jpg', alt: 'Лебедев С.А.' }],
    bio:
      '<strong>Лебедев С.А.</strong> — один из основоположников советской вычислительной техники. Под его руководством были созданы многие типы ЭВМ, от ламповых до машин на интегральных схемах.',
  },
  'ЭВМ «М-100»': {
    title: 'Китов А.И.',
    images: [{ src: 'images/kitov.jpg', alt: 'Китов А.И.' }],
    bio:
      '<strong>Китов А.И.</strong> — пионер отечественной кибернетики и информатики, участник разработки ЭВМ М-100 и основатель вычислительных центров для сложных задач.',
  },
  'Baikal-M': {
    title: 'Baikal Electronics',
    images: [{ src: 'images/razrabbaikal.jpg', alt: 'Baikal Electronics' }],
    bio:
      '«Байкал Электроникс» — российская компания, создающая отечественные процессоры. Проект Baikal-M разрабатывался командой инженеров компании.',
  },
  '«Искра 1030»': {
    title: 'Ярошевская М.Б.',
    images: [{ src: 'images/iskra-bio.jpg', alt: 'Ярошевская М.Б.' }],
    bio:
      '<strong>Ярошевская М.Б.</strong> — технический директор ОАО СКБ ВТ «Искра», действительный член АЭН РФ, выпускница ЛИТМО (1964).',
  },
  'ЭВМ «Стрела»': {
    title: 'Базилевский Ю.Я.',
    images: [{ src: 'images/Юрий_Яковлевич_Базилевский.jpg', alt: 'Базилевский Ю.Я.' }],
    bio:
      '<strong>Базилевский Ю.Я.</strong> — главный конструктор ЭВМ «Стрела», дважды лауреат Сталинской премии, Герой Социалистического Труда.',
  },
  EPSILON: {
    title: 'Ершов А.П.',
    images: [{ src: 'images/bf24a856d8d71fb8c7591767530727ec.jpg', alt: 'Ершов А.П.' }],
    bio:
      '<strong>Ершов А.П.</strong> — учёный в области программирования и основоположник сибирской школы информатики. Вклад: теория компиляции, стандартизация языков, идея «второй грамотности».',
  },
};

function setOpen(panelEl, isOpen) {
  panelEl.style.transform = isOpen ? 'translateX(0)' : 'translateX(105%)';
}

function renderTooltip({ tooltip, markerEl }) {
  const { name, description: desc, image: img } = markerEl.dataset;

  tooltip.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:10px">
      <img src="${img}" alt="${name}" style="width:60px;height:60px;border-radius:8px;object-fit:cover">
      <div style="line-height:1.25">
        <div style="font-weight:700;margin-bottom:4px">${name}</div>
        <div style="opacity:0.9">${desc || ''}</div>
      </div>
    </div>
    <button data-action="open" style="margin-top:10px;background:#c73b3b;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer">Читать далее</button>
  `;

  tooltip.style.display = 'block';
  tooltip.style.visibility = 'hidden';
}

async function positionTooltip({ tooltip, markerEl }) {
  await new Promise((r) => requestAnimationFrame(r));

  const markerRect = markerEl.getBoundingClientRect();
  const ttRect = tooltip.getBoundingClientRect();
  const padding = 8;

  let left = markerRect.left + (markerRect.width - ttRect.width) / 2;
  left = Math.max(padding, Math.min(left, window.innerWidth - ttRect.width - padding));

  let top = markerRect.bottom + padding;
  if (top + ttRect.height > window.innerHeight - padding) {
    top = markerRect.top - ttRect.height - padding;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.visibility = 'visible';
}

function renderSidePanel({ sidePanel, markerEl }) {
  const { name, description: desc, image: img, author, more } = markerEl.dataset;

  sidePanel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
      <div style="font-size:18px;font-weight:700">${name}</div>
      <button data-action="close" aria-label="Close" style="background:transparent;border:none;color:#fff;font-size:22px;cursor:pointer">×</button>
    </div>
    <div style="margin-top:12px">
      <img src="${img}" alt="${name}" style="width:100%;border-radius:12px;max-height:220px;object-fit:cover">
    </div>
    <p style="margin-top:12px;opacity:0.95">${desc || ''}</p>
    <p style="margin-top:10px;opacity:0.9"><strong>Место разработки:</strong> ${author || 'Неизвестно'}</p>
    ${more ? `<p style="margin-top:10px;opacity:0.9">${more}</p>` : ''}
    <button data-action="author" style="margin-top:14px;background:#c73b3b;color:#fff;border:none;padding:10px 12px;border-radius:10px;cursor:pointer;width:100%">Об авторе ➡️</button>
  `;

  setOpen(sidePanel, true);
}

function renderAuthorPanel({ authorPanel, productName }) {
  const entry = AUTHOR_DATA[productName];

  const imagesHtml = (entry?.images || [])
    .map(
      (i) =>
        `<img src="${i.src}" alt="${i.alt}" style="width:100%;border-radius:12px;max-height:260px;object-fit:cover;margin-top:10px">`,
    )
    .join('');

  authorPanel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
      <div style="font-size:18px;font-weight:700">Биография</div>
      <button data-action="close" aria-label="Close" style="background:transparent;border:none;color:#fff;font-size:22px;cursor:pointer">×</button>
    </div>
    <div style="margin-top:8px;opacity:0.9">${entry?.title ? `<strong>${entry.title}</strong>` : ''}</div>
    ${imagesHtml}
    <p style="margin-top:12px;line-height:1.4;opacity:0.95">${
      entry?.bio || 'Пока нет данных об авторе для этого экспоната.'
    }</p>
    <button data-action="back" style="margin-top:14px;background:#444;color:#fff;border:none;padding:10px 12px;border-radius:10px;cursor:pointer;width:100%">⬅️ Назад</button>
  `;

  setOpen(authorPanel, true);
}

function setupMarkerDelegation({ container, tooltip, sidePanel, authorPanel }) {
  let tooltipHover = false;

  tooltip.style.pointerEvents = 'auto';
  tooltip.addEventListener('mouseenter', () => {
    tooltipHover = true;
  });
  tooltip.addEventListener('mouseleave', () => {
    tooltipHover = false;
    tooltip.style.display = 'none';
  });

  container.addEventListener('mouseover', async (e) => {
    const marker = e.target.closest?.('.marker');
    if (!marker) return;

    renderTooltip({ tooltip, markerEl: marker });
    await positionTooltip({ tooltip, markerEl: marker });

    const openBtn = tooltip.querySelector('[data-action="open"]');
    if (openBtn) {
      openBtn.onclick = () => {
        renderSidePanel({ sidePanel, markerEl: marker });
      };
    }
  });

  container.addEventListener('mouseout', (e) => {
    const marker = e.target.closest?.('.marker');
    if (!marker) return;
    setTimeout(() => {
      if (!tooltipHover) tooltip.style.display = 'none';
    }, 200);
  });

  sidePanel.addEventListener('click', (e) => {
    const btn = e.target.closest?.('[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    if (action === 'close') {
      setOpen(sidePanel, false);
    }

    if (action === 'author') {
      const productName = sidePanel.querySelector('div')?.textContent?.trim();
      renderAuthorPanel({ authorPanel, productName });
    }
  });

  authorPanel.addEventListener('click', (e) => {
    const btn = e.target.closest?.('[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    if (action === 'close') setOpen(authorPanel, false);
    if (action === 'back') setOpen(authorPanel, false);
  });
}

async function loadMarkers(container) {
  const requests = INVENTION_IDS.map((id) => fetchJson(`${API_BASE}/${id}`));
  const results = await Promise.allSettled(requests);

  results.forEach((r, idx) => {
    if (r.status === 'fulfilled' && r.value?.html_code) {
      appendHtml(container, r.value.html_code);
      return;
    }
    console.error(`Failed to load invention id=${INVENTION_IDS[idx]}`, r);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('map');
  if (!container) {
    console.error('Map container #map not found');
    return;
  }

  const ui = ensureUiSkeleton();
  setupMarkerDelegation({ container, ...ui });

  try {
    await loadMarkers(container);
  } catch (e) {
    console.error(e);
  }
});