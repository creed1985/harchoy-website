/**
 * HARCHOY — Scroll-Triggered Animations Fallback
 * Intersection Observer for browsers without animation-timeline support
 * < 1KB minified
 */
(function(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-fallback, .reveal-fallback--left, .reveal-fallback--right, .reveal-fallback--scale')
    .forEach(el => observer.observe(el));
})();
