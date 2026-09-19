// Optional: put a Formspree / Basin / custom API endpoint here.
// Example: const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxx";
const FORM_ENDPOINT = "";

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const button = item.querySelector('button');
  button.addEventListener('click', () => {
    const alreadyOpen = item.classList.contains('open');
    faqItems.forEach(other => other.classList.remove('open'));
    if (!alreadyOpen) item.classList.add('open');
  });
});

// Scroll reveal
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('visible'));
}

// Static-site lead form handler
const leadForm = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');

function isValidIranPhone(value) {
  const normalized = value.replace(/[\s-]/g, '');
  return /^09\d{9}$/.test(normalized);
}

if (leadForm) {
  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.textContent = '';
    formStatus.style.color = '#d9480f';

    const data = new FormData(leadForm);
    const phone = String(data.get('phone') || '');

    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      return;
    }

    if (!isValidIranPhone(phone)) {
      formStatus.textContent = 'لطفاً شماره موبایل را به شکل 09xxxxxxxxx وارد کنید.';
      return;
    }

    if (!FORM_ENDPOINT) {
      formStatus.style.color = '#6f7580';
      formStatus.textContent = 'فرم آماده است؛ برای ثبت واقعی درخواست‌ها، FORM_ENDPOINT را در script.js تنظیم کنید.';
      return;
    }

    const submitButton = leadForm.querySelector('button[type="submit"]');
    const oldText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'در حال ارسال...';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Request failed');
      leadForm.reset();
      formStatus.style.color = '#138a5b';
      formStatus.textContent = 'درخواست شما با موفقیت ارسال شد.';
    } catch (error) {
      formStatus.style.color = '#c92a2a';
      formStatus.textContent = 'ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = oldText;
    }
  });
}
