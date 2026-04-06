function setupRegionHoverLabel(svg) {
    if (!svg) return;

    // создаём tooltip
    let tooltip = document.getElementById('regionHoverLabel');

    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'regionHoverLabel';
        document.body.appendChild(tooltip);
        tooltip.className = 'region-hover-label'
    }

    const paths = svg.querySelectorAll('path');

    paths.forEach((path) => {

        path.addEventListener('mouseenter', (e) => {
            const name =
                path.dataset.title ||
                path.dataset.region ||
                path.getAttribute('title') ||
                path.getAttribute('aria-label') ||
                '';

            if (!name) return;

            if (typeof typeText === 'function') {
                tooltip.classList.add('typing');

                typeText(tooltip, name, 18).finally(() => {
                    tooltip.classList.remove('typing');
                });
            } else {
                tooltip.textContent = name;
            }
            tooltip.style.opacity = '1';

        });

        path.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.clientX + 12}px`;
            tooltip.style.top = `${e.clientY + 12}px`;
        });

        path.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}