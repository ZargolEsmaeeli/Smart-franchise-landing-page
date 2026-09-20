// Google Apps Script endpoint for SMART franchise leads
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzKxHeNInRhO8sunrmlcjakDUE4OZJl7Skc7hPw9i9t4mCX6rpbgS3lJHnpvN4EkeGd/exec";

// Mobile menu
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

// General scroll reveal
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

// Story progress line
const storyTrack = document.querySelector('.story-track');
if (storyTrack && 'IntersectionObserver' in window) {
  const storyObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      storyTrack.classList.add('story-active');
      storyObserver.disconnect();
    }
  }, { threshold: 0.3 });
  storyObserver.observe(storyTrack);
}

// Finance bars
const financeCard = document.querySelector('.finance-card');
if (financeCard && 'IntersectionObserver' in window) {
  const financeObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      financeCard.classList.add('animate-bars');
      financeObserver.disconnect();
    }
  }, { threshold: 0.35 });
  financeObserver.observe(financeCard);
}

// Collaboration journey progress
const timeline = document.querySelector('.timeline');
if (timeline && 'IntersectionObserver' in window) {
  const timelineObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      timeline.classList.add('timeline-active');
      timelineObserver.disconnect();
    }
  }, { threshold: 0.35 });
  timelineObserver.observe(timeline);
}

// Light hero parallax for desktop pointers
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('mousemove', e => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.transform = `perspective(1000px) rotateY(${x * 2.2}deg) rotateX(${-y * 2.2}deg)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    heroVisual.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
}

// Lead form
const leadForm = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');

function isValidIranPhone(value) {
  const normalized = value.replace(/[\s-]/g, '');
  return /^09\d{9}$/.test(normalized);
}

if (leadForm) {
  leadForm.addEventListener('submit', async event => {
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
      formStatus.textContent = 'درخواست شما با موفقیت ثبت شد. همکاران ما با شما تماس خواهند گرفت.';
    } catch (error) {
      console.error(error);
      formStatus.style.color = '#c92a2a';
      formStatus.textContent = 'ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = oldText;
    }
  });
}
