document.querySelectorAll('.marker').forEach(marker => {
    marker.addEventListener('mouseenter', () => {
        const name = marker.dataset.name;
        const desc = marker.dataset.description;

        document.getElementById('tooltip-text').innerHTML = `<strong>${name}</strong><br>${desc}`;
        tooltip.style.display = 'block';
        tooltip.style.left = `calc(${marker.style.left} + 10px)`;
        tooltip.style.top = `calc(${marker.style.top} + 10px)`;

        document.getElementById('read-more').onclick = () => {
            openSidePanel(marker);
        };
    });

    marker.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});




document.querySelectorAll('.marker').forEach(marker => {
    marker.addEventListener('mouseenter', () => {
        const name = marker.dataset.name;
        const desc = marker.dataset.description;

        document.getElementById('tooltip-text').innerHTML = `<strong>${name}</strong><br>${desc}`;
        tooltip.style.display = 'block';
        tooltip.style.left = `calc(${marker.style.left} + 10px)`;
        tooltip.style.top = `calc(${marker.style.top} + 10px)`;

        document.getElementById('read-more').onclick = () => {
            openSidePanel(marker);
        };
    });

    marker.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});

