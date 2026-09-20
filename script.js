// Optional: put a Formspree / Basin / custom API endpoint here.
// Example: const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxx";
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzKxHeNInRhO8sunrmlcjakDUE4OZJl7Skc7hPw9i9t4mCX6rpbgS3lJHnpvN4EkeGd/exec";

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

  await fetch(FORM_ENDPOINT, {
    method: 'POST',
    body: data,
    mode: 'no-cors'
  });

  leadForm.reset();

  formStatus.style.color = '#138a5b';
  formStatus.textContent =
    'درخواست شما با موفقیت ثبت شد. همکاران ما با شما تماس خواهند گرفت.';

} catch (error) {

  console.error(error);

  formStatus.style.color = '#c92a2a';
  formStatus.textContent =
    'ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.';

}
  });
}

// ==========================================================
// SMART Motion Enhancements
// ==========================================================


// ----------------------------------------------------------
// Finance bars animation
// ----------------------------------------------------------

const financeCard = document.querySelector('.finance-card');

if (financeCard) {

  const financeObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          financeCard.classList.add('animate-bars');

          financeObserver.unobserve(financeCard);
        }

      });

    },
    {
      threshold: 0.35
    }
  );

  financeObserver.observe(financeCard);
}


// ----------------------------------------------------------
// Timeline progress animation
// ----------------------------------------------------------

const timeline = document.querySelector('.timeline');

if (timeline) {

  const timelineObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          timeline.classList.add('timeline-active');

          timelineObserver.unobserve(timeline);

        }

      });

    },
    {
      threshold: 0.35
    }
  );

  timelineObserver.observe(timeline);
}


// ----------------------------------------------------------
// Hero mouse parallax
// ----------------------------------------------------------

const heroVisual = document.querySelector('.hero-visual');

if (
  heroVisual &&
  window.matchMedia('(pointer:fine)').matches
) {

  const heroImage =
    heroVisual.querySelector(':scope > img');

  heroVisual.addEventListener(
    'mousemove',
    event => {

      const rect =
        heroVisual.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - .5;

      const y =
        (event.clientY - rect.top) / rect.height - .5;

      heroVisual.style.setProperty(
        '--mouse-x',
        x
      );

      heroVisual.style.setProperty(
        '--mouse-y',
        y
      );

      if (heroImage) {

        heroImage.style.transform =
          `translate3d(${x * 8}px, ${y * 8}px, 0)`;

      }

    }
  );

  heroVisual.addEventListener(
    'mouseleave',
    () => {

      if (heroImage) {

        heroImage.style.transform =
          'translate3d(0,0,0)';

      }

    }
  );
}


// ----------------------------------------------------------
// Automatic stagger animation
// ----------------------------------------------------------

const staggerGroups = [
  '.infra-grid',
  '.benefit-grid',
  '.stats-grid',
  '.timeline'
];

staggerGroups.forEach(selector => {

  const group =
    document.querySelector(selector);

  if (!group) return;

  [...group.children].forEach(
    (child, index) => {

      child.style.transitionDelay =
        `${Math.min(index * 90, 450)}ms`;

    }
  );

});
