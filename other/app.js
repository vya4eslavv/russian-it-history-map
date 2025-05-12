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


const cardTooltip = document.getElementById('cardTooltip');

document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const title = card.dataset.title || '';
        const details = card.dataset.details || '';
        cardTooltip.innerHTML = `<strong>${title}</strong><br>${details}`;
        cardTooltip.style.display = 'block';
    });

    card.addEventListener('mousemove', (e) => {
        cardTooltip.style.left = e.pageX + 15 + 'px';
        cardTooltip.style.top = e.pageY + 15 + 'px';
    });

    card.addEventListener('mouseleave', () => {
        cardTooltip.style.display = 'none';
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


