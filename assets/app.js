(() => {
  'use strict';
  const raw = String(window.SITE_CONFIG?.whatsappNumber || '96894054911');
  const number = raw.replace(/[^0-9]/g, '');
  const validNumber = /^[1-9]\d{7,14}$/.test(number);
  const baseMessage = 'مرحبًا منتجات رقمية، أرغب في طلب برنامج الأنشطة الصفية التفاعلية لمدرستي ومعرفة السعر وتفاصيل التجهيز.';
  const requestUrl = (organization = '', note = '', program = 'برنامج الأنشطة الصفية التفاعلية') => {
    let text = baseMessage.replace('برنامج الأنشطة الصفية التفاعلية', program);
    if (organization.trim()) text += '\nالمدرسة أو الجهة: ' + organization.trim();
    if (note.trim()) text += '\nالاستفسار: ' + note.trim();
    return 'https://api.whatsapp.com/send?phone=' + number + '&text=' + encodeURIComponent(text);
  };
  if (validNumber) {
    document.querySelectorAll('[data-order]').forEach(a => { a.href = requestUrl('', '', a.dataset.order); a.target = '_blank'; a.rel = 'noopener noreferrer'; });

  }
  document.querySelectorAll('[data-demo]').forEach(a => {
    const url = window.SITE_CONFIG?.demoUrl;
    if (url && /^https:\/\//.test(url)) a.href = url;
  });
  document.querySelectorAll('[data-year]').forEach(e => { e.textContent = new Date().getFullYear(); });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const closeMenu = () => {
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'فتح القائمة'); nav?.classList.remove('open');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const form = document.getElementById('request-form');
  form?.addEventListener('submit', () => {
    // Native form submission opens WhatsApp outside the embedded site.
    // Update the hidden message synchronously; retain native navigation.
    if (!validNumber) return;
    const url = new URL(requestUrl(form.elements.organization.value, form.elements.note.value));
    form.elements.phone.value = number;
    form.elements.text.value = url.searchParams.get('text');
  });
})();
