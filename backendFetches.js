// frontend/app.js
async function fetchData(url) {
    let result = await fetch(url);
    return result.json()
}
// 1. Хелпер для вставки HTML-фрагмента и реинициализации маркеров
function insertMarkers(htmlString) {
    const container = document.getElementById('map');
    const frag      = document.createRange().createContextualFragment(htmlString);
    container.appendChild(frag);
    // не нужны ручные биндинги — всё через делегирование
}

// 2. Делегирование событий для .marker
// function setupMarkerDelegation() {
//     const container = document.getElementById('map');
//     const tooltip   = document.getElementById('tooltip');
//     const sidePanel = document.getElementById('sidePanel');
//     let tooltipHover = false;
//
//     // тултип: наведено на него?
//     tooltip.addEventListener('mouseenter', () => tooltipHover = true);
//     tooltip.addEventListener('mouseleave', () => {
//         tooltipHover = false;
//         tooltip.style.display = 'none';
//     });
//
//     // делегируем mouseenter/mouseleave от контейнера
//     container.addEventListener('mouseover', e => {
//         const marker = e.target.closest('.marker');
//         if (!marker) return;
//
//         const { name, description: desc, image: img } = marker.dataset;
//         tooltip.innerHTML = `
//       <div style="display:flex;align-items:flex-start;gap:10px">
//         <img src="${img}" alt="${name}" style="width:60px;height:60px;border-radius:6px;object-fit:cover">
//         <div><strong>${name}</strong><br>${desc}</div>
//       </div>
//       <button>Читать далее</button>
//     `;
//         tooltip.style.display = 'block';
//         tooltip.style.left  = `calc(${marker.style.left} + 200px)`;
//         tooltip.style.top   = `calc(${marker.style.top} + 100px)`;
//         tooltip.querySelector('button').onclick = () => openSidePanel(marker);
//     });
//
//     container.addEventListener('mouseout', e => {
//         const marker = e.target.closest('.marker');
//         if (!marker) return;
//         setTimeout(() => {
//             if (!tooltipHover) tooltip.style.display = 'none';
//         }, 200);
//     });
// }

function setupMarkerDelegation() {
    const container = document.getElementById('map');
    const tooltip   = document.getElementById('tooltip');
    let tooltipHover = false;

    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'auto'; // чтобы mouseenter/leave работали

    tooltip.addEventListener('mouseenter', () => tooltipHover = true);
    tooltip.addEventListener('mouseleave', () => {
        tooltipHover = false;
        tooltip.style.display = 'none';
    });

    container.addEventListener('mouseover', async e => {
        const marker = e.target.closest('.marker');
        if (!marker) return;

        const { name, description: desc, image: img } = marker.dataset;
        tooltip.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px">
        <img src="${img}" alt="${name}" style="width:60px;height:60px;border-radius:6px;object-fit:cover">
        <div><strong>${name}</strong><br>${desc}</div>
      </div>
      <button>Читать далее</button>
    `;
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden'; // на время измерений

        // Дадим браузеру время вставить контент и посчитать размеры
        await new Promise(r => requestAnimationFrame(r));

        const markerRect = marker.getBoundingClientRect();
        const ttRect     = tooltip.getBoundingClientRect();
        const padding    = 8; // отступ от маркера

        // Центральная позиция относительно маркера
        let left = markerRect.left + (markerRect.width - ttRect.width) / 2;
        // Не вылазим влево/вправо
        left = Math.max(padding, Math.min(left, window.innerWidth - ttRect.width - padding));

        // Сначала пытаемся показать снизу, иначе сверху
        let top = markerRect.bottom + padding;
        if (top + ttRect.height > window.innerHeight - padding) {
            top = markerRect.top - ttRect.height - padding;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top  = `${top}px`;
        tooltip.style.visibility = 'visible';

        tooltip.querySelector('button').onclick = () => openSidePanel(marker);
    });

    container.addEventListener('mouseout', e => {
        const marker = e.target.closest('.marker');
        if (!marker) return;
        setTimeout(() => {
            if (!tooltipHover) tooltip.style.display = 'none';
        }, 200);
    });
}

// 3. Сайд-панель
function openSidePanel(marker) {
    const sidePanel = document.getElementById('sidePanel');
    const { name, description: desc, image: img, author, more } = marker.dataset;

    sidePanel.innerHTML = `
    <img src="${img}" alt="${name}">
    <h2>${name}</h2>
    <p>${desc}</p>
    <p><strong>Место разработки:</strong> ${author || 'Неизвестный автор'}</p>
    ${more ? `<p>${more}</p>` : ''}
    <button id="showAuthor" class="btn-author">Об авторе ➡️</button>`;
    sidePanel.classList.add('open');

    document.getElementById('showAuthor')
        .onclick = () => openAuthorPanel(name);
}

// 4. Панель автора
function openAuthorPanel(productName) {
    const authorPanel = document.getElementById('authorPanel');
    let bio = '', img = '';

    if (productName === 'Урал-1') {
        bio = `<strong>Рамеев Б.И.</strong> — советский изобретатель...`;
        img = `<img src="images/Рамеев_Башир_Искандарович.jpg" alt="Рамеев Б.И." class="author-img">`;
    } else if (productName === 'Baikal-M') {
        bio = `<strong>Baikal Electronics</strong> — российская компания...`;
        img = `<img src="images/baikal-electronics.jpg" alt="Baikal Electronics" class="author-img">`;
    }

    authorPanel.innerHTML = `
    ${img}
    <h2>Биография</h2>
    <p>${bio}</p>
    <button id="closeAuthor" class="btn-close">⬅️ Назад</button>
  `;
    authorPanel.classList.add('open', 'second-level');

    document.getElementById('closeAuthor')
        .onclick = () => authorPanel.classList.remove('open', 'second-level');
}

// 5. Инициализация всего
document.addEventListener('DOMContentLoaded', () => {
    // 5.1 биндим делегирование маркеров
    setupMarkerDelegation();

    // 5.2 пример fetch-запроса
    fetchData('http://localhost:8080/api/invention/get/2')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);

    fetchData('http://localhost:8080/api/invention/get/13')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);

    fetchData('http://localhost:8080/api/invention/get/14')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);

    fetchData('http://localhost:8080/api/invention/get/15')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);

    fetchData('http://localhost:8080/api/invention/get/16')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);

    fetchData('http://localhost:8080/api/invention/get/17')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);

    fetchData('http://localhost:8080/api/invention/get/18')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);

    fetchData('http://localhost:8080/api/invention/get/19')
        .then(data => {
            insertMarkers(data.html_code);
            // после вставки маркеры «оживут» автоматически через делегирование
        })
        .catch(console.error);
});

//
// fetchData("http://localhost:8080/api/invention/get/2")
//     .then(data => {
//         const container = document.getElementById("map");
//
//         // 1) Преобразуем строку HTML в DocumentFragment
//         const frag = document
//             .createRange()
//             .createContextualFragment(data.html_code);
//
//         // 2) Вставляем этот фрагмент в контейнер
//         container.appendChild(frag);
//         bindMarkers(container)
//     })

//     fetchData("http://localhost:8080/api/invention/get/11").then(data => {
//     document.getElementById("map").innerHTML += data.html_code;
// })


// function bindMarkers(container = document) {
//     const tooltip = document.getElementById('tooltip');
//     const sidePanel = document.getElementById('sidePanel');
//     let tooltipHover = false;
//
//     // чтобы не заводить дубликаты, снимем старые обработчики (простой вариант)
//     container.querySelectorAll('.marker').forEach(marker => {
//         marker.replaceWith(marker.cloneNode(true));
//     });
//
//     container.querySelectorAll('.marker').forEach(marker => {
//         marker.addEventListener('mouseenter', () => {
//             const {name, description: desc, image: img} = marker.dataset;
//             tooltip.innerHTML = `
//         <div style="display:flex;gap:8px">
//           <img src="${img}" style="width:60px;height:60px;border-radius:4px">
//           <div><strong>${name}</strong><br>${desc}</div>
//         </div>
//         <button>Читать далее</button>
//       `;
//             tooltip.style.display = 'block';
//             tooltip.style.left = `calc(${marker.style.left} + 10px)`;
//             tooltip.style.top = `calc(${marker.style.top} + 10px)`;
//
//             tooltip.querySelector('button').onclick = () => openSidePanel(marker);
//         });
//         marker.addEventListener('mouseleave', () => {
//             setTimeout(() => {
//                 if (!tooltipHover) tooltip.style.display = 'none';
//             }, 100);
//         });
//     });
//
//     tooltip.addEventListener('mouseenter', () => tooltipHover = true);
//     tooltip.addEventListener('mouseleave', () => {
//         tooltipHover = false;
//         tooltip.style.display = 'none';
//     });
// }
//
// function openSidePanel(marker) {
//     const name = marker.dataset.name;
//     const desc = marker.dataset.description;
//     const img = marker.dataset.image;
//     const author = marker.dataset.author || 'Неизвестный автор';
//     const more = marker.dataset.more || '';
//
//     sidePanel.innerHTML = `
//             <img src="${img}" alt="${name}">
//             <h2>${name}</h2>
//             <p>${desc}</p>
//             <p><strong>Место разработки:</strong> ${author}</p>
//             ${more ? `<p>${more}</p>` : ''}
//             <button id="showAuthor" style="margin-top: 15px; background-color: #c73b3b; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Об авторе ➡️</button>
//         `;
//
//     sidePanel.classList.add('open');
//
//     document.getElementById('showAuthor').onclick = () => {
//         openAuthorPanel(marker.dataset.name);
//     };
// }
//
// function openAuthorPanel(productName) {
//     const authorPanel = document.getElementById('authorPanel');
//
//     // Данные для разных продуктов
//     let bio = '';
//     let img = '';
//
//     if (productName === 'Урал-1') {
//         bio = `<strong>Рамеев Б.И.</strong> — советский изобретатель, разработчик первых советских ЭВМ. Доктор технических наук, лауреат Сталинской премии. В Пензе, в сентябре 2013 года был открыт Технопарк высоких технологий «Рамеев», названный в честь первого в России создателя ЭВМ.
// `;
//         img = `<img src="images/Рамеев_Башир_Искандарович.jpg" alt="Рамеев Б.И." style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">`;
//     } else if (productName === 'Baikal-M') {
//         bio = `<strong>Baikal Electronics</strong> — российская компания, основанная для создания отечественных процессоров. Разработала Baikal-M в 2016-2018 годах в Красногорске.`;
//         img = `<img src="images/baikal-electronics.jpg" alt="Baikal Electronics" style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">`;
//     }
//
//     authorPanel.innerHTML = `
//         ${img}
//         <h2>Биография</h2>
//         <p>${bio}</p>
//         <button id="closeAuthor" style="margin-top: 15px; background-color: #555; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">⬅️ Назад</button>
//     `;
//
//
//     authorPanel.classList.add('open');
//     authorPanel.classList.add('second-level');
//
//     document.getElementById('closeAuthor').onclick = () => {
//         authorPanel.classList.remove('open');
//     };
// }
//
// sidePanel.addEventListener('mouseenter', () => {
//     if (!sidePanel.classList.contains('open')) {
//         sidePanel.classList.add('hovered');
//     }
// });
//
// sidePanel.addEventListener('mouseleave', () => {
//     sidePanel.classList.remove('hovered');
// });
//
// sidePanel.addEventListener('click', () => {
//     sidePanel.classList.remove('open');
// });
