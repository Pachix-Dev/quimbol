// Progressive enhancement: content remains visible without JS or observer support.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const animationClasses = ['motion-safe:animate-fade-in-up', 'animate-duration-400'];
let observer: IntersectionObserver | undefined;

function stopMotion() {
  observer?.disconnect();
  observer = undefined;
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    element.classList.remove(...animationClasses);
  });
}

function initMotion() {
  stopMotion();
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const element = target as HTMLElement;
      // Once per visit, never replay when filtering products or scrolling back.
      observer?.unobserve(element);
      element.classList.add(...animationClasses);
      element.addEventListener('animationend', () => {
        element.classList.remove(...animationClasses);
      }, { once: true });
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    // Above-the-fold content already has a View Transition; avoid a second fade.
    if (element.getBoundingClientRect().top >= window.innerHeight) observer?.observe(element);
  });
}

document.addEventListener('astro:page-load', initMotion);
document.addEventListener('astro:before-swap', stopMotion);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) stopMotion();
});
