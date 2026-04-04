function ensureHoverLabel() {
  let el = document.getElementById('regionHoverLabel');
  if (el) return el;

  el = document.createElement('div');
  el.id = 'regionHoverLabel';
  document.body.appendChild(el);
  return el;
}

function setupRegionHoverLabel(svg) {
  const label = ensureHoverLabel();

  function show(text) {
    if (!text) return;
    label.textContent = text;
    label.style.display = 'block';
  }

  function hide() {
    label.style.display = 'none';
  }

  function move(e) {
    // чуть смещаем, чтобы не закрывать курсор
    const offset = 12;
    let x = e.clientX + offset;
    let y = e.clientY + offset;

    // чтобы не вылезало за края окна
    const rect = label.getBoundingClientRect();
    const pad = 8;

    if (x + rect.width > window.innerWidth - pad) {
      x = e.clientX - rect.width - offset;
    }
    if (y + rect.height > window.innerHeight - pad) {
      y = e.clientY - rect.height - offset;
    }

    label.style.left = `${Math.max(pad, x)}px`;
    label.style.top = `${Math.max(pad, y)}px`;
  }

  svg.addEventListener('pointerover', (e) => {
    const p = e.target.closest?.('path');
    if (!p || !svg.contains(p)) return;

    const title = p.dataset?.title?.trim();
    if (!title) return;

    show(title);
    move(e);
  });

  svg.addEventListener('pointermove', (e) => {
    if (label.style.display === 'none') return;
    move(e);
  });

  svg.addEventListener('pointerout', (e) => {
    const p = e.target.closest?.('path');
    if (!p) return;
    hide();
  });

  // если курсор ушёл из окна — тоже спрячем
  window.addEventListener('blur', hide);
}