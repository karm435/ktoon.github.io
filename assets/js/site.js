(() => {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('i')?.classList.toggle('fa-bars', !open);
    navToggle.querySelector('i')?.classList.toggle('fa-xmark', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.querySelector('i')?.classList.add('fa-bars');
    navToggle?.querySelector('i')?.classList.remove('fa-xmark');
  }));

  document.querySelectorAll('[data-comparison]').forEach((comparison) => {
    const range = comparison.querySelector('[data-comparison-range]');
    range?.addEventListener('input', () => comparison.style.setProperty('--position', `${range.value}%`));
  });

  const modeExplorer = document.querySelector('[data-mode-explorer]');
  if (modeExplorer) {
    const preview = modeExplorer.querySelector('.mode-preview');
    const image = modeExplorer.querySelector('[data-mode-image]');
    const title = modeExplorer.querySelector('[data-mode-title]');
    const copy = modeExplorer.querySelector('[data-mode-copy]');
    modeExplorer.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        modeExplorer.querySelectorAll('.mode-tab').forEach((item) => {
          const active = item === tab;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        preview.classList.add('is-changing');
        window.setTimeout(() => {
          image.src = tab.dataset.image;
          image.alt = `Example output for ${tab.dataset.title}`;
          title.textContent = tab.dataset.title;
          copy.textContent = tab.dataset.copy;
          preview.classList.remove('is-changing');
        }, 170);
      });
    });
  }

  const collageImage = document.querySelector('[data-collage-image]');
  const collageTitle = document.querySelector('[data-collage-title]');
  const collageCopy = document.querySelector('[data-collage-copy]');
  const collageMain = collageImage?.closest('.collage-main');
  const collageThumbs = [...document.querySelectorAll('.collage-thumb')];
  const selectCollage = (thumb) => {
    if (!thumb || !collageImage) return;
    collageThumbs.forEach((item) => item.classList.toggle('is-active', item === thumb));
    collageMain.classList.add('is-changing');
    window.setTimeout(() => {
      collageImage.src = thumb.dataset.image;
      collageImage.alt = `${thumb.dataset.title} family collage`;
      collageTitle.textContent = thumb.dataset.title;
      collageCopy.textContent = thumb.dataset.copy;
      collageMain.classList.remove('is-changing');
    }, 170);
  };
  collageThumbs.forEach((thumb) => thumb.addEventListener('click', () => {
    selectCollage(thumb);
    document.querySelectorAll('.people-pill').forEach((pill) => pill.classList.toggle('is-active', pill.dataset.people === thumb.dataset.peopleGroup));
  }));
  document.querySelectorAll('.people-pill').forEach((pill) => pill.addEventListener('click', () => {
    document.querySelectorAll('.people-pill').forEach((item) => item.classList.toggle('is-active', item === pill));
    selectCollage(collageThumbs.find((thumb) => thumb.dataset.peopleGroup === pill.dataset.people));
  }));

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const cards = [...track.querySelectorAll('.screen-card')];
    const dots = carousel.querySelector('[data-carousel-dots]');
    let activeIndex = 0;

    const setActive = (index) => {
      activeIndex = Math.max(0, Math.min(index, cards.length - 1));
      [...dots.children].forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeIndex));
    };
    cards.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = `carousel-dot${index === 0 ? ' is-active' : ''}`;
      dots.appendChild(dot);
    });
    const move = (direction) => {
      const target = Math.max(0, Math.min(activeIndex + direction, cards.length - 1));
      cards[target].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActive(target);
    };
    carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => move(-1));
    carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => move(1));
    track.addEventListener('scroll', () => {
      const cardWidth = cards[0]?.getBoundingClientRect().width || 1;
      setActive(Math.round(track.scrollLeft / (cardWidth + 24)));
    }, { passive: true });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    reveals.forEach((item) => observer.observe(item));
  }
})();
