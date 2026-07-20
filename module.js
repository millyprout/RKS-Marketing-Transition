document.addEventListener('DOMContentLoaded', () => {
  const toc = [...document.querySelectorAll('.module-toc a')];
  const sections = toc.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        toc.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.directory-row').forEach(row => {
      row.classList.toggle('is-hidden', filter !== 'all' && !row.dataset.category.split(' ').includes(filter));
    });
  }));

  const query = new URLSearchParams(window.location.search).get('q');
  const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
  if (target) {
    const revealTarget = () => {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      target.classList.add('search-target-highlight');
      window.setTimeout(() => target.classList.remove('search-target-highlight'), 2700);
    };

    // Run once after the DOM is ready and again after the page finishes
    // loading so images/fonts cannot shift the destination away from view.
    requestAnimationFrame(revealTarget);
    window.addEventListener('load', revealTarget, { once: true });
  }

  if (query && target) {
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim() || node.parentElement.closest('script, style, mark')) return NodeFilter.FILTER_REJECT;
        return terms.some(term => node.nodeValue.toLowerCase().includes(term)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.slice(0, 20).forEach(node => {
      const pattern = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
      const parts = node.nodeValue.split(pattern);
      if (parts.length === 1) return;
      const fragment = document.createDocumentFragment();
      parts.forEach(part => {
        if (terms.includes(part.toLowerCase())) {
          const mark = document.createElement('mark');
          mark.className = 'search-word-highlight';
          mark.textContent = part;
          fragment.appendChild(mark);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(fragment, node);
    });
  }
});
