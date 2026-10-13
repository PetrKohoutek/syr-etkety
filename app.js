(() => {
  const menuItems = [
    { cz: 'obsah/04_menu_1_cz.txt', en: 'obsah/05_menu_1_aj.txt', bodyCz: 'obsah/14_text_menu_1_cz.md', bodyEn: 'obsah/15_text_menu_1_aj.md' },
    { cz: 'obsah/06_menu_2_cz.txt', en: 'obsah/07_menu_2_aj.txt', bodyCz: 'obsah/16_text_menu_2_cz.md', bodyEn: 'obsah/17_text_menu_2_aj.md' },
    { cz: 'obsah/08_menu_3_cz.txt', en: 'obsah/09_menu_3_aj.txt', bodyCz: 'obsah/18_text_menu_3_cz.md', bodyEn: 'obsah/19_text_menu_3_aj.md' }
  ];
  let language = 'cz';
  let activeItem = 0;
  const menu = document.querySelector('#menu');
  const menuOptions = document.querySelector('#menu-options');
  const menuToggle = document.querySelector('#menu-toggle');
  const menuCurrent = document.querySelector('#menu-current');
  const content = document.querySelector('#content');
  const languageSwitch = document.querySelector('.language-switch');

  async function readText(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Nepodařilo se načíst ${path}`);
    return response.text();
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function renderMarkdown(markdown) {
    return markdown.trim().split(/\n\s*\n/).filter(Boolean).map((paragraph) => {
      const safe = escapeHtml(paragraph).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      return `<p>${safe.replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }

  // --- Visit counter setup ---
  const COUNTER_NAMESPACE = 'petrkohoutek-syr-etkety';
  const COUNTER_KEY = 'visits';
  const SESSION_FLAG = 'syr_counter_counted_v1';
  let showCounter = true;

  const visitCounter = document.createElement('div');
  visitCounter.id = 'visit-counter';
  visitCounter.className = 'visit-counter';
  visitCounter.setAttribute('role', 'status');
  visitCounter.setAttribute('aria-live', 'polite');
  visitCounter.textContent = '—';
  languageSwitch.appendChild(visitCounter);

  function formatNumber(n) {
    return new Intl.NumberFormat(language === 'cz' ? 'cs-CZ' : 'en-US').format(n);
  }

  async function fetchCount(hit = false) {
    const base = 'https://api.countapi.xyz';
    const url = hit
      ? `${base}/hit/${encodeURIComponent(COUNTER_NAMESPACE)}/${encodeURIComponent(COUNTER_KEY)}`
      : `${base}/get/${encodeURIComponent(COUNTER_NAMESPACE)}/${encodeURIComponent(COUNTER_KEY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('countapi response not ok');
    return res.json();
  }

  async function initCounter() {
    try {
      const cfg = await readText('obsah/20_counter_on_off.txt');
      showCounter = String(cfg).trim().toLowerCase() === 'on';
    } catch (e) {
      showCounter = true;
    }

    visitCounter.style.display = showCounter ? 'inline-grid' : 'none';
    visitCounter.setAttribute('aria-label', language === 'cz' ? 'Počet přístupů' : 'Visit count');

    try {
      if (!sessionStorage.getItem(SESSION_FLAG)) {
        if (navigator.onLine) {
          const hitRes = await fetchCount(true);
          sessionStorage.setItem(SESSION_FLAG, '1');
          if (hitRes && typeof hitRes.value !== 'undefined') {
            visitCounter.textContent = formatNumber(hitRes.value);
          }
        }
      }
      if (navigator.onLine) {
        const getRes = await fetchCount(false);
        if (getRes && typeof getRes.value !== 'undefined') {
          visitCounter.textContent = formatNumber(getRes.value);
        }
      }
    } catch (err) {
      console.warn('Visit counter error', err);
    }
  }

  window.addEventListener('online', async () => {
    try {
      if (!sessionStorage.getItem(SESSION_FLAG)) {
        const hitRes = await fetchCount(true);
        sessionStorage.setItem(SESSION_FLAG, '1');
        if (hitRes && typeof hitRes.value !== 'undefined') {
          visitCounter.textContent = formatNumber(hitRes.value);
        }
      } else {
        const getRes = await fetchCount(false);
        if (getRes && typeof getRes.value !== 'undefined') {
          visitCounter.textContent = formatNumber(getRes.value);
        }
      }
    } catch (err) {
      console.warn('Visit counter online refresh failed', err);
    }
  });

  async function render() {
    menuOptions.replaceChildren();
    for (const [index, item] of menuItems.entries()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `menu-item${index === activeItem ? ' is-active' : ''}`;
      button.textContent = (await readText(language === 'cz' ? item.cz : item.en)).trim();
      button.setAttribute('aria-current', index === activeItem ? 'page' : 'false');
      button.addEventListener('click', () => {
        activeItem = index;
        menu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        render();
        content.focus({ preventScroll: true });
      });
      menuOptions.append(button);
    }

    menuCurrent.textContent = (await readText(language === 'cz' ? menuItems[activeItem].cz : menuItems[activeItem].en)).trim();
    const item = menuItems[activeItem];
    const markdown = await readText(language === 'cz' ? item.bodyCz : item.bodyEn);
    content.innerHTML = renderMarkdown(markdown);
    document.documentElement.lang = language === 'cz' ? 'cs' : 'en';
    menu.setAttribute('aria-label', language === 'cz' ? 'Hlavní menu' : 'Main menu');
    document.querySelector('.photo-strip').setAttribute('aria-label', language === 'cz' ? 'Ukázky ze sbírky' : 'Collection examples');

    visitCounter.setAttribute('aria-label', language === 'cz' ? 'Počet přístupů' : 'Visit count');
    const parsed = Number(String(visitCounter.textContent).replace(/\s/g, '').replace(/[^\d]/g, ''));
    if (!Number.isNaN(parsed)) visitCounter.textContent = formatNumber(parsed);
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.language-button').forEach((button) => {
    button.addEventListener('click', () => {
      language = button.dataset.language;
      document.querySelectorAll('.language-button').forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle('is-active', selected);
        choice.setAttribute('aria-pressed', String(selected));
      });

      visitCounter.setAttribute('aria-label', language === 'cz' ? 'Počet přístupů' : 'Visit count');
      const parsed = Number(String(visitCounter.textContent).replace(/\s/g, '').replace(/[^\d]/g, ''));
      if (!Number.isNaN(parsed)) visitCounter.textContent = formatNumber(parsed);

      render();
    });
  });

Promise.all([
  readText('obsah/02_text_hlavicka_cz.txt'),
  readText('obsah/03_text_hlavicka_aj.txt'),
  readText('obsah/20_counter_on_off.txt').catch(() => 'on')
]).then(async ([cz, en, cfg]) => {
  document.querySelector('#header-cz').textContent = cz.trim();
  document.querySelector('#header-en').textContent = en.trim();

  await render();

  // podle obsahu souboru zapnout/vypnout zobrazení badge (off = skryto)
  const off = String(cfg).trim().toLowerCase() === 'off';
  const badge = document.getElementById('visitor-badge');
  if (badge) badge.classList.toggle('hidden', off);

  // skryjeme starý visit-counter pokud existuje (zabrání duplicitě)
  const old = document.getElementById('visit-counter');
  if (old) old.style.display = 'none';
}).catch((error) => {
  content.textContent = 'Obsah se nepodařilo načíst.';
  console.error(error);
});
})();
