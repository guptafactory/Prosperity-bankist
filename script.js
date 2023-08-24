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
  // makes sections transparent on Application start
});

// Lazy loading the images -> For efficiency & performance

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // Replace low-res img with high-res img
  entry.target.src = entry.target.dataset.src;
  // Image blur should not be removed until the high- res image is loaded (on even low internet connections)
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '50px',
});
imgTargets.forEach(img => imgObserver.observe(img));

/// Slider & Dot Scrolling of the testimonials ///
// Variables
const slides = document.querySelectorAll('.slide');
let currSlide = 0;
const maxSlide = slides.length;

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

// Functions
const moveSlide = () => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currSlide)}%)`;
  });
};

const moveRight = function () {
  if (currSlide === maxSlide - 1) currSlide = 0;
  else currSlide++;
  moveSlide();
  activateDot();
};

const moveLeft = function () {
  if (currSlide === 0) currSlide = maxSlide - 1;
  else currSlide--;
  moveSlide();
  activateDot();
};

const dotContainer = document.querySelector('.dots');
// creating dots element & inserting it
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function () {
  // remove active class from all dots
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  // add active dot to current slide
  document
    .querySelector(`.dots__dot[data-slide="${currSlide}"]`)
    .classList.add('dots__dot--active');
};

moveSlide();
createDots();
activateDot();

// Event Listeners

btnRight.addEventListener('click', moveRight);

btnLeft.addEventListener('click', moveLeft);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
});

dotContainer.addEventListener('click', function (e) {
  // if clicked on dots
  if (e.target.classList.contains('dots__dot')) {
    currSlide = e.target.dataset.slide; // current slide number
    moveSlide();
    activateDot();
  }
});
