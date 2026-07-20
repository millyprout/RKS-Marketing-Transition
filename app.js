const APP_DATA = window.RKS_APP_DATA || {};

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const openSidebarButton = document.getElementById('openSidebar');
  const collapseSidebarButton = document.getElementById('collapseSidebar');
  const searchInput = document.getElementById('dashboardSearch');
  const clearSearchButton = document.getElementById('clearSearch');
  const globalSearchResults = document.getElementById('globalSearchResults');
  const toast = document.getElementById('toast');

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const normalizeSearch = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  function renderMetrics() {
    const container = document.getElementById('metricGrid');
    if (!container) return;
    container.innerHTML = (APP_DATA.metrics || []).map(item => `
      <article class="metric-card">
        <span class="metric-card__label">${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <span class="metric-card__meta">${escapeHtml(item.meta)}</span>
      </article>`).join('');
  }

  function renderSessions() {
    const container = document.getElementById('sessionGrid');
    if (!container) return;
    container.innerHTML = (APP_DATA.sessions || []).map(session => {
      const number = String(session.number).padStart(2, '0');
      if (session.featured) {
        const entries = (session.modules || []).map(module => `
          <a class="session-entry session-entry--${escapeHtml(module.brand)}" href="${escapeHtml(module.url)}">
            <span class="session-entry__mark"><img alt="" src="${escapeHtml(module.logo)}"/></span>
            <span><small>${escapeHtml(module.label)}</small><strong>${escapeHtml(module.title)}</strong><em>${escapeHtml(module.subtitle)}</em></span>
            <span aria-hidden="true" class="session-entry__arrow">→</span>
          </a>`).join('');
        return `
          <article class="session-card session-card--featured" data-search="${escapeHtml(session.search)}">
            <div class="session-feature__copy">
              <div class="session-card__topline"><span class="session-number">${number}</span></div>
              <p class="eyebrow">Working Session ${session.number}</p>
              <h3>${escapeHtml(session.title)}</h3>
              <p>${escapeHtml(session.description)}</p>
              <div class="session-feature__meta"><span>Working Session ${session.number}</span><span>${(session.modules || []).length} connected modules</span></div>
            </div>
            <div aria-label="Open Session ${session.number} modules" class="session-entry-grid">${entries}</div>
          </article>`;
      }
      return `
        <article class="session-card" data-search="${escapeHtml(session.search)}" id="session-${number}">
          <div class="session-card__topline"><span class="session-number">${number}</span></div>
          <h3>${escapeHtml(session.title)}</h3>
          <p>${escapeHtml(session.description)}</p>
          <div class="session-card__footer"><span>Working Session ${session.number}</span><span class="reference-label">Outline to be built</span></div>
        </article>`;
    }).join('');
  }

  function renderBrands() {
    const container = document.getElementById('brandGrid');
    if (!container) return;
    container.innerHTML = (APP_DATA.brands || []).map(brand => `
      <article class="brand-card brand-card--${escapeHtml(brand.brand)}" id="search-${escapeHtml(brand.id)}">
        <div class="brand-card__accent"></div>
        <div class="brand-card__body">
          <div class="brand-card__header">
            <div class="brand-logo"><img alt="${escapeHtml(brand.name)}" src="${escapeHtml(brand.logo)}"/></div>
            <span class="reference-label">${escapeHtml(brand.label)}</span>
          </div>
          <h3>${escapeHtml(brand.name)}</h3>
          <p>${escapeHtml(brand.description)}</p>
          <ul aria-label="${escapeHtml(brand.name)} module topics" class="tag-list">${(brand.topics || []).map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>
          <a class="button button--brand" href="${escapeHtml(brand.url)}">${escapeHtml(brand.button)}</a>
        </div>
      </article>`).join('');
  }

  function renderDeliverables() {
    const container = document.getElementById('taskList');
    if (!container || !APP_DATA.deliverables) return;
    const d = APP_DATA.deliverables;
    container.innerHTML = `
      <div class="deliverable-session-heading" data-search="session ${d.sessionNumber} ${escapeHtml(d.sessionTitle)}">
        <strong>Working Session ${d.sessionNumber}: ${escapeHtml(d.sessionTitle)}</strong>
        <small>${escapeHtml(d.dueText)}</small>
      </div>
      ${(d.items || []).map((item, index) => `
        <label class="task-item" data-search="${escapeHtml(item)}">
          <input type="checkbox" data-deliverable-id="session-${d.sessionNumber}-${index + 1}"/>
          <span><strong>${escapeHtml(item)}</strong><small>Helena · ${escapeHtml(d.dueText)}</small></span>
        </label>`).join('')}
      <div class="deliverable-future-note">
        <strong>Future Session Deliverables</strong>
        <small>${escapeHtml(d.futureMessage)}</small>
      </div>`;
  }

  function renderResources() {
    const container = document.getElementById('resourceList');
    if (!container) return;
    container.innerHTML = (APP_DATA.resources || []).map(resource => `
      <a class="resource-item" href="${escapeHtml(resource.url)}" id="search-${escapeHtml(resource.id)}">
        <span class="resource-item__icon">${escapeHtml(resource.icon)}</span>
        <span><strong>${escapeHtml(resource.title)}</strong><small>${escapeHtml(resource.description)}</small></span>
        <span>→</span>
      </a>`).join('');
  }

  function renderApplication() {
    renderMetrics();
    renderSessions();
    renderBrands();
    renderDeliverables();
    renderResources();
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function updateSidebarToggle() {
    if (!collapseSidebarButton) return;
    const collapsed = body.classList.contains('sidebar-collapsed');
    const icon = collapseSidebarButton.querySelector('.sidebar-toggle__icon');
    const label = collapseSidebarButton.querySelector('.sidebar-toggle__label');
    collapseSidebarButton.setAttribute('aria-expanded', String(!collapsed));
    collapseSidebarButton.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
    if (icon) icon.textContent = collapsed ? '›' : '‹';
    if (label) label.textContent = collapsed ? 'Expand navigation' : 'Collapse navigation';
  }

  function highlightMatch(value, terms) {
    let output = escapeHtml(value);
    terms.filter(Boolean).sort((a,b) => b.length-a.length).forEach(term => {
      const safe = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      output = output.replace(new RegExp(`(${safe})`, 'ig'), '<mark>$1</mark>');
    });
    return output;
  }

  function buildSnippet(text, rawQuery) {
    const source = String(text || '').replace(/\s+/g, ' ').trim();
    const query = String(rawQuery || '').trim();
    const index = source.toLowerCase().indexOf(query.toLowerCase());
    if (index < 0) return '';
    const start = Math.max(0, index - 100);
    const end = Math.min(source.length, index + query.length + 120);
    return `${start ? '…' : ''}${source.slice(start, end).trim()}${end < source.length ? '…' : ''}`;
  }

  function resultUrl(url, query) {
    const [path, hash = ''] = url.split('#');
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}q=${encodeURIComponent(query)}${hash ? `#${hash}` : ''}`;
  }

  function renderGlobalSearch() {
    if (!globalSearchResults || !searchInput) return;
    const raw = searchInput.value.trim();
    clearSearchButton?.classList.toggle('is-visible', Boolean(raw));
    if (!raw) {
      globalSearchResults.innerHTML = '';
      globalSearchResults.classList.remove('is-visible');
      return;
    }
    const normalized = normalizeSearch(raw);
    const terms = normalized.split(' ').filter(Boolean);
    const index = Array.isArray(window.RKS_SEARCH_INDEX) ? window.RKS_SEARCH_INDEX : [];
    const matches = [];
    index.forEach(item => {
      const text = `${item.title} ${item.page} ${item.text}`;
      if (!terms.every(term => normalizeSearch(text).includes(term))) return;
      const snippet = buildSnippet(item.text, raw) || buildSnippet(`${item.title} — ${item.page}`, raw);
      if (snippet) matches.push({ ...item, snippet });
    });
    globalSearchResults.innerHTML = matches.length ? matches.slice(0,24).map(item => `
      <a class="global-search-result" href="${escapeHtml(resultUrl(item.url, raw))}">
        <span class="global-search-result__meta"><span>${escapeHtml(item.page)}</span><span>Open →</span></span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${highlightMatch(item.snippet, terms)}</p>
      </a>`).join('') : '<div class="global-search-empty">No exact instances found.</div>';
    globalSearchResults.classList.add('is-visible');
  }

  function resetSearch({ keepFocus = false } = {}) {
    if (!searchInput) return;
    searchInput.value = '';
    renderGlobalSearch();
    if (keepFocus) searchInput.focus();
  }

  renderApplication();

  openSidebarButton?.addEventListener('click', () => body.classList.toggle('sidebar-open'));
  collapseSidebarButton?.addEventListener('click', () => {
    if (window.innerWidth <= 980) body.classList.remove('sidebar-open');
    else body.classList.toggle('sidebar-collapsed');
    updateSidebarToggle();
  });
  sidebar?.addEventListener('click', event => {
    const link = event.target.closest('.nav-item');
    if (!link) return;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('is-active'));
    link.classList.add('is-active');
    if (window.innerWidth <= 980) body.classList.remove('sidebar-open');
  });

  searchInput?.addEventListener('input', renderGlobalSearch);
  searchInput?.addEventListener('focus', renderGlobalSearch);
  searchInput?.addEventListener('keydown', event => {
    if (event.key === 'Escape') { resetSearch(); searchInput.blur(); }
    if (event.key === 'Enter') globalSearchResults?.querySelector('.global-search-result')?.click();
  });
  clearSearchButton?.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); resetSearch({ keepFocus: true }); });
  globalSearchResults?.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', event => {
    if (event.target.closest('.search, #globalSearchResults, .global-search-results')) return;
    resetSearch();
  });

  document.getElementById('taskList')?.addEventListener('change', event => {
    const checkbox = event.target.closest('input[type="checkbox"]');
    if (!checkbox) return;
    checkbox.closest('.task-item')?.classList.toggle('is-complete', checkbox.checked);
    showToast(checkbox.checked ? 'Deliverable marked complete' : 'Deliverable reopened');
  });

  document.getElementById('resourceList')?.addEventListener('click', event => {
    const link = event.target.closest('a[href="#"]');
    if (!link) return;
    event.preventDefault();
    showToast('This resource will be connected when it is ready.');
  });

  window.addEventListener('resize', () => { if (window.innerWidth > 980) body.classList.remove('sidebar-open'); });
  updateSidebarToggle();
});
