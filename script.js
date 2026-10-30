
(() => {
const APP_URL = 'https://finova-accounting-system.vercel.app';

const DEMO_REQUEST_URL =
  'https://bqcupgoylxvxbyymomjw.supabase.co/functions/v1/finova-demo-email';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_xTpK998Tvm0JmMo9ciLT8Q_otdrwVYc';

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const year = document.querySelector('#year');
  const form = document.querySelector('#demo-form');
  const formNote = document.querySelector('#form-note');
  const industry = document.querySelector('#industry');
  const industryOtherWrap = document.querySelector('#industry-other-wrap');
  const industryOther = document.querySelector('#industry-other');
  const need = document.querySelector('#need');
  const statusBox = document.querySelector('#demo-submit-status');
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!form) return;

  // Tautan aplikasi FINOVA.
  document
    .querySelectorAll('a[href^="https://finova-accounting-system.vercel.app"]')
    .forEach(link => {
      link.href = APP_URL;
    });

  if (year) year.textContent = new Date().getFullYear();

  // Navigasi mobile.
  menuButton?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open') ?? false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Tutup navigasi' : 'Buka navigasi'
    );
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  // Buat kolom WhatsApp jika belum tersedia di HTML.
  let whatsapp = form.querySelector('[name="whatsapp"]');

  if (!whatsapp) {
    const emailInput = form.querySelector('#email');
    const emailLabel = form.querySelector('label[for="email"]');

    const whatsappLabel = document.createElement('label');
    whatsappLabel.htmlFor = 'whatsapp';
    whatsappLabel.textContent = 'Nomor WhatsApp';

    whatsapp = document.createElement('input');
    whatsapp.type = 'tel';
    whatsapp.id = 'whatsapp';
    whatsapp.name = 'whatsapp';
    whatsapp.autocomplete = 'tel';
    whatsapp.placeholder = 'Contoh: +6281234567890';
    whatsapp.required = true;
    whatsapp.maxLength = 30;
    whatsapp.setAttribute('aria-describedby', 'whatsapp-help');

    const whatsappHelp = document.createElement('small');
    whatsappHelp.id = 'whatsapp-help';
    whatsappHelp.textContent = 'Gunakan nomor WhatsApp aktif.';

    if (emailInput && emailLabel) {
      emailInput.insertAdjacentElement('afterend', whatsappLabel);
      whatsappLabel.insertAdjacentElement('afterend', whatsapp);
      whatsapp.insertAdjacentElement('afterend', whatsappHelp);
    } else {
      form.insertBefore(whatsappLabel, form.querySelector('button[type="submit"]'));
      form.insertBefore(whatsapp, form.querySelector('button[type="submit"]'));
      form.insertBefore(whatsappHelp, form.querySelector('button[type="submit"]'));
    }
  }

  // Bidang usaha: tampilkan input jika memilih Lainnya.
  const updateIndustryOther = () => {
    if (!industry || !industryOtherWrap || !industryOther) return;

    const showOther = industry.value === 'Lainnya';
    industryOtherWrap.hidden = !showOther;
    industryOther.required = showOther;

    if (!showOther) industryOther.value = '';
  };

  industry?.addEventListener('change', updateIndustryOther);
  updateIndustryOther();

  // Buat input kebutuhan khusus jika belum tersedia di HTML.
  let needOther = form.querySelector('[name="need_other"]');

  if (need && !needOther) {
    const needOtherWrap = document.createElement('div');
    needOtherWrap.id = 'need-other-wrap';
    needOtherWrap.hidden = true;

    const needOtherLabel = document.createElement('label');
    needOtherLabel.htmlFor = 'need-other';
    needOtherLabel.textContent = 'Jelaskan kebutuhan utama Anda';

    needOther = document.createElement('textarea');
    needOther.id = 'need-other';
    needOther.name = 'need_other';
    needOther.rows = 3;
    needOther.maxLength = 2000;
    needOther.placeholder =
      'Tuliskan kebutuhan perusahaan yang ingin didiskusikan';
    needOther.required = false;

    needOtherWrap.append(needOtherLabel, needOther);

    need.insertAdjacentElement('afterend', needOtherWrap);
  }

  const needOtherWrap = document.querySelector('#need-other-wrap');

  const updateNeedOther = () => {
    if (!need || !needOther || !needOtherWrap) return;

    const showOther = ['Lainnya', 'Other'].includes(need.value);
    needOtherWrap.hidden = !showOther;
    needOther.required = showOther;

    if (!showOther) needOther.value = '';
  };

  need?.addEventListener('change', updateNeedOther);
  updateNeedOther();

  // Status formulir.
  const showStatus = (type, message) => {
    if (!statusBox) return;

    statusBox.hidden = false;
    statusBox.className = `demo-submit-status is-${type}`;
    statusBox.textContent = message;
  };

  // Pengiriman formulir demo.
  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);

    const name = String(data.get('name') || '').trim();
    const company = String(data.get('company') || '').trim();
    const email = String(data.get('email') || '').trim();
    const whatsappValue = String(data.get('whatsapp') || '').trim();

    const industryChoice = String(data.get('industry') || '').trim();
    const industryCustom = String(data.get('industry_other') || '').trim();
    const chosenIndustry = industryChoice === 'Lainnya'
      ? industryCustom
      : industryChoice;

    const employees = String(data.get('employees') || '').trim();
    const selectedNeed = String(data.get('need') || '').trim();
    const customNeed = String(data.get('need_other') || '').trim();

    const isOtherNeed = ['Lainnya', 'Other'].includes(selectedNeed);
    const finalNeed = isOtherNeed ? customNeed : selectedNeed;

    if (
      !name ||
      !company ||
      !email ||
      !whatsappValue ||
      !chosenIndustry ||
      !finalNeed
    ) {
      showStatus(
        'error',
        'Mohon lengkapi semua kolom wajib, termasuk keterangan jika memilih Lainnya.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('error', 'Format email tidak valid.');
      return;
    }

    if (!/^\+?[0-9\s()-]{8,30}$/.test(whatsappValue)) {
      showStatus(
        'error',
        'Nomor WhatsApp tidak valid. Periksa kembali nomor yang Anda masukkan.'
      );
      return;
    }

    const payload = {
      name,
      company,
      email,
      whatsapp: whatsappValue,
      industry: chosenIndustry,
      employees,
      need: finalNeed,
      needOther: isOtherNeed ? customNeed : ''
    };

    showStatus('loading', 'Mengirim permintaan demo ke email FINOVA…');

    if (formNote) formNote.textContent = '';

    const originalButtonHTML = submitButton?.innerHTML;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.textContent = 'Mengirim permintaan…';
    }

    try {
      const response = await fetch(DEMO_REQUEST_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
          `Permintaan gagal diproses (HTTP ${response.status}).`
        );
      }

      showStatus(
        'success',
        'Terima kasih! Permintaan demo berhasil dikirim ke tim FINOVA.'
      );

      form.reset();
      updateIndustryOther();
      updateNeedOther();

    } catch (error) {
      console.error('FINOVA demo submission error:', error);

      showStatus(
        'error',
        'Permintaan gagal dikirim. Periksa koneksi dan Console browser, lalu coba kembali.'
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.innerHTML =
          originalButtonHTML || 'Siapkan Permintaan <span>→</span>';
      }
    }
  });
})();
