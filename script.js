'use strict';

///////////////////////////////////////

/// Variables ///

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

// Buttons
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

// Sections & header
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');

// Nav
const scrollNavLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;

// Tab
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//// Functions ////

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Random color Generation
const random256 = () => {
  return Math.trunc(Math.random() * 256);
};
const randomColor = () =>
  `rgb(${random256()},${random256()},${random256()}, ${0.25})`;

// Hover on Nav links
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; // Active Link (opacity -> 1)
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(ele => {
      if (ele !== link) ele.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

// Sticky Navbar
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

//// Event Listeners ////

// Modal window
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// 'Learn more' button of header
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Scroll Nav links
scrollNavLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id !== null && id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Operations tab
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return; // if clicked outside buttons
  // Remove old tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(cnt =>
    cnt.classList.remove('operations__content--active')
  );
  // Activate new Tab
  clicked.classList.add('operations__tab--active');
  // Activate new Content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Nav links mouse hover
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// Header - Intersection Observer
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // % of intersection at which callback will be called
  rootMargin: `-${navHeight}px`,
  // move the boundary of target element
});
headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
  // makes sections transprent on Application start
});
