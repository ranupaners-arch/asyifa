// Hero parallax
export function setupParallax() {
  const heroBg = document.getElementById('heroBg');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.getElementById('hero');
    const heroTop = hero.offsetTop;
    const heroHeight = hero.offsetHeight;

    if (scrollY < heroTop + heroHeight) {
      const progress = scrollY / heroHeight;
      const translateY = progress * 12;
      heroBg.style.transform = `translateY(${translateY}%)`;
    }
  });
}