export function setupScrollAnimation(listSelector) {
  const listItems = document.querySelectorAll(listSelector);

  const observerOptions = {
    root: null, // Viewport as root
    rootMargin: '0px',
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      const { target } = entry;

      
      const scaleFactor = 0.7 + entry.intersectionRatio * 0.4; 
      const opacityFactor = 0.5 + entry.intersectionRatio * 0.5; 

      target.style.transform = `scale(${scaleFactor})`;
      target.style.opacity = opacityFactor.toFixed(3);
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  listItems.forEach((item) => {
    item.style.transition =
      'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease-in-out'; 
    observer.observe(item);
  });
}
