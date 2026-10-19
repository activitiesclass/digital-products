(() => {
  'use strict';
  const config = window.SITE_CONFIG;
  if (!config || !/^\d{8,15}$/.test(config.whatsappNumber)) return;
  const requestUrl = (program, organization = '', note = '') => {
    let message = program === 'برنامج الأنشطة الصفية التفاعلية'
      ? 'مرحبًا منتجات رقمية، أرغب في طلب معلومات عن برنامج الأنشطة الصفية التفاعلية، ومعرفة السعر وتفاصيل التجهيز.'
      : 'مرحبًا منتجات رقمية، أود التواصل معكم بخصوص: ' + program + '.';
    if (organization.trim()) message += '\nالمدرسة أو الجهة: ' + organization.trim();
    if (note.trim()) message += '\nالاستفسار: ' + note.trim();
    return 'https://wa.me/' + config.whatsappNumber + '?text=' + encodeURIComponent(message);
  };
  document.querySelectorAll('[data-order]').forEach(link => {
    link.href = requestUrl(link.dataset.order);
    link.target = '_blank'; link.rel = 'noopener noreferrer';
  });
  document.querySelectorAll('[data-demo]').forEach(link => {
    link.href = config.demoUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
  });
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
      menu.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open');
    }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') {
      menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open');
    }});
  }
  let category = 'all';
  const search = document.getElementById('program-search');
  const update = () => {
    const value = (search?.value || '').trim(); let visible = 0;
    document.querySelectorAll('[data-product]').forEach(card => {
      const match = (!value || card.dataset.product.includes(value)) && (category === 'all' || card.dataset.category === category);
      card.hidden = !match; if (match) visible++;
    });
    const upcoming = document.querySelector('[data-upcoming]');
    if (upcoming) upcoming.hidden = category !== 'all' || !!value;
    const empty = document.querySelector('.empty-state'); if (empty) empty.hidden = visible > 0;
  };
  search?.addEventListener('input', update);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button));
    }); update();
  }));
  const form = document.getElementById('request-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const url = requestUrl('برنامج الأنشطة الصفية التفاعلية', form.elements.organization.value, form.elements.note.value);
    window.location.assign(url);
  });
})();
