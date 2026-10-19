(() => {
  'use strict';
  const raw = String(window.SITE_CONFIG?.whatsappNumber || '96895214998');
  const number = raw.replace(/[^0-9]/g, '');
  const validNumber = /^[1-9]\d{7,14}$/.test(number);
  const baseMessage = 'مرحبًا منتجات رقمية، أرغب في طلب برنامج الأنشطة الصفية التفاعلية لمدرستي ومعرفة السعر وتفاصيل التجهيز.';
  const requestUrl = (organization = '', note = '') => {
    let text = baseMessage;
    if (organization.trim()) text += '\nالمدرسة أو الجهة: ' + organization.trim();
    if (note.trim()) text += '\nالاستفسار: ' + note.trim();
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
  };
  if (validNumber) {
    document.querySelectorAll('[data-order]').forEach(a => { a.href = requestUrl(); a.removeAttribute('target'); });
    const fallback = document.querySelector('.contact-help a');
    if (fallback) fallback.href = 'https://api.whatsapp.com/send?phone=' + number + '&text=' + encodeURIComponent(baseMessage);
    const phone = document.querySelector('.phone-line bdi');
    if (phone) phone.textContent = '+' + number;
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
  form?.addEventListener('submit', e => {
    if (!validNumber) return; // Preserve the native form action and its fallback number.
    e.preventDefault();
    window.location.assign(requestUrl(form.elements.organization.value, form.elements.note.value));
  });
  document.querySelector('.copy-number')?.addEventListener('click', async () => {
    const value = '+' + (validNumber ? number : '96895214998');
    const status = document.querySelector('.copy-status');
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
      else {
        const field = document.createElement('textarea'); field.value = value;
        field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field);
        field.select(); const ok = document.execCommand('copy'); field.remove();
        if (!ok) throw new Error('copy unavailable');
      }
      status.textContent = 'تم نسخ رقم واتساب.';
    } catch { status.textContent = 'يمكنك تحديد الرقم الظاهر ونسخه يدويًا.'; }
  });
})();
