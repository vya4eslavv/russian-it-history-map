const typewriterState = new WeakMap();

function typeText(element, text, speed = 18) {
  if (!element) return Promise.resolve();

  const prev = typewriterState.get(element);
  if (prev) {
    prev.cancelled = true;
  }

  const state = { cancelled: false };
  typewriterState.set(element, state);

  element.textContent = '';

  return new Promise((resolve) => {
    let i = 0;

    function tick() {
      if (state.cancelled) {
        resolve();
        return;
      }

      element.textContent = text.slice(0, i);
      i += 1;

      if (i <= text.length) {
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    }

    tick();
  });
}