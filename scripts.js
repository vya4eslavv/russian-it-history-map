document.addEventListener('DOMContentLoaded', () => {
  // ===== Timeline cards reveal =====
  const cards = Array.from(document.querySelectorAll('.timeline-card'));
  if (cards.length) {
    cards.forEach((card, i) => {
      card.style.setProperty('--delay', `${i * 100}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );

    cards.forEach((card) => observer.observe(card));
  }

  // ===== Slider controls =====
  const track = document.querySelector('.slider-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const slideEl = document.querySelector('.slide');

  if (track && prevBtn && nextBtn && slideEl) {
    const slideWidth = slideEl.offsetWidth + 20; // + margin

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });

    // Auto-scroll
    setInterval(() => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
      if (!atEnd) {
        track.scrollBy({ left: slideWidth, behavior: 'smooth' });
        return;
      }
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }, 3000);
  }

  // ===== Daily question widget =====
  const questions = [
    {
      q: 'В каком году запущена МЭСМ?',
      isCorrect: (a) => a.includes('1951'),
    },
    {
      q: 'Кто руководил разработкой БЭСМ-6?',
      isCorrect: (a) => a.includes('лебедев'),
    },
    {
      q: 'Как назывался первый советский транзисторный компьютер?',
      isCorrect: (a) => a.includes('минск'),
    },
    {
      q: 'Где был создан Урал-1?',
      isCorrect: (a) => a.includes('пенза'),
    },
    {
      q: 'Как называется архитектура Эльбрус-1?',
      isCorrect: (a) => a.includes('vliw'),
    },
  ];

  const qElem = document.getElementById('dq-question');
  const input = document.getElementById('dq-answer');
  const submit = document.getElementById('dq-submit');
  const feedback = document.getElementById('dq-feedback');

  if (qElem && input && submit && feedback) {
    const picked = questions[Math.floor(Math.random() * questions.length)];
    qElem.textContent = picked.q;

    submit.addEventListener('click', () => {
      const ans = input.value.trim().toLowerCase();
      const ok = picked.isCorrect(ans);

      if (ok) {
        feedback.textContent = 'Верно! Молодец.';
        feedback.style.color = '#8bc34a';
        return;
      }
      feedback.textContent = 'Не совсем так, попробуйте ещё.';
      feedback.style.color = '#f44336';
    });
  }
});



// КАРТА logic НЕ ТРОГАТЬ НИ В КОЕМ СЛУЧАЕ
