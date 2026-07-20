const deliverablesConfig = {
  currentSession: {
    number: 1,
    title: 'Marketing Overview & Ecosystem',
    dueText: 'Due before Working Session 2',
    items: [
      '5–10 questions about anything that is unclear',
      '3 observations or takeaways from your exploration',
      'Any resources or processes you had difficulty locating or understanding',
    ],
  },
  futureMessage: 'Future session deliverables will be added after each working session.',
};

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    completedTasks: 0,
  };

  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const openSidebarButton = document.getElementById('openSidebar');
  const collapseSidebarButton = document.getElementById('collapseSidebar');
  const searchInput = document.getElementById('dashboardSearch');
  const clearSearchButton = document.getElementById('clearSearch');
  const searchFeedback = document.getElementById('searchFeedback');
  const globalSearchResults = document.getElementById('globalSearchResults');
  const toast = document.getElementById('toast');

  function renderCurrentDeliverables() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const panel = taskList.closest('.panel');
    const heading = panel?.querySelector('.panel__header h2');
    const { currentSession, futureMessage } = deliverablesConfig;

    if (heading) heading.textContent = 'Post-Session Deliverables';

    taskList.innerHTML = `
      <div class="deliverable-session-heading" data-search="session ${currentSession.number} ${currentSession.title}">
        <strong>Working Session ${currentSession.number}: ${currentSession.title}</strong>
        <small>${currentSession.dueText}</small>
      </div>
      ${currentSession.items.map((item, index) => `
        <label class="task-item" data-search="${item}">
          <input type="checkbox" data-deliverable-id="session-${currentSession.number}-${index + 1}" />
          <span>
            <strong>${item}</strong>
            <small>Helena · ${currentSession.dueText}</small>
          </span>
        </label>
      `).join('')}
      <div class="deliverable-future-note" data-search="future session deliverables to be confirmed">
        <strong>Future Session Deliverables</strong>
        <small>${futureMessage}</small>
      </div>
    `;
  }

  renderCurrentDeliverables();

  const sessionCards = [...document.querySelectorAll('.session-card')];
  const taskCheckboxes = [...document.querySelectorAll('.task-item input')];
  const searchableItems = [
    ...sessionCards,
    ...document.querySelectorAll('.brand-card'),
    ...document.querySelectorAll('.task-item'),
    ...document.querySelectorAll('.deliverable-session-heading'),
    ...document.querySelectorAll('.deliverable-future-note'),
    ...document.querySelectorAll('.resource-item'),
  ];


  const globalSearchIndex = Array.isArray(window.RKS_SEARCH_INDEX) ? window.RKS_SEARCH_INDEX : [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function highlightMatch(value, terms) {
    let output = escapeHtml(value);
    terms.filter(Boolean).sort((a,b) => b.length-a.length).forEach(term => {
      const safe = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      output = output.replace(new RegExp(`(${safe})`, 'ig'), '<mark>$1</mark>');
    });
    return output;
  }

  function resultUrl(url, query) {
    const [path, hash = ''] = url.split('#');
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}q=${encodeURIComponent(query)}${hash ? `#${hash}` : ''}`;
  }

  function buildMatchSnippets(text, rawQuery, maxSnippets = 6) {
    const source = String(text || '').replace(/\s+/g, ' ').trim();
    const query = String(rawQuery || '').trim();
    if (!source || !query) return [];

    const sourceLower = source.toLowerCase();
    const queryLower = query.toLowerCase();
    const positions = [];
    let fromIndex = 0;

    while (fromIndex < sourceLower.length) {
      const matchIndex = sourceLower.indexOf(queryLower, fromIndex);
      if (matchIndex === -1) break;
      positions.push(matchIndex);
      fromIndex = matchIndex + Math.max(queryLower.length, 1);
      if (positions.length >= maxSnippets) break;
    }

    // For multi-word searches that are not an exact phrase, only return text
    // where every typed term appears inside the displayed excerpt.
    if (positions.length === 0) {
      const terms = normalizeSearch(query).split(' ').filter(Boolean);
      if (!terms.length || !terms.every(term => normalizeSearch(source).includes(term))) return [];
      const firstIndex = Math.min(...terms.map(term => sourceLower.indexOf(term)).filter(index => index >= 0));
      if (Number.isFinite(firstIndex)) positions.push(firstIndex);
    }

    return positions.map(position => {
      const radius = 105;
      let snippetStart = Math.max(0, position - radius);
      let snippetEnd = Math.min(source.length, position + query.length + radius);

      if (snippetStart > 0) {
        const nextSpace = source.indexOf(' ', snippetStart);
        if (nextSpace !== -1 && nextSpace < position) snippetStart = nextSpace + 1;
      }
      if (snippetEnd < source.length) {
        const previousSpace = source.lastIndexOf(' ', snippetEnd);
        if (previousSpace > position + query.length) snippetEnd = previousSpace;
      }

      return `${snippetStart > 0 ? '…' : ''}${source.slice(snippetStart, snippetEnd).trim()}${snippetEnd < source.length ? '…' : ''}`;
    });
  }

  function renderGlobalSearch() {
    if (!globalSearchResults || !searchInput) return;
    const raw = searchInput.value.trim();
    const normalized = normalizeSearch(raw);
    const terms = normalized ? normalized.split(' ').filter(Boolean) : [];

    clearSearchButton?.classList.toggle('is-visible', Boolean(raw));
    if (terms.length === 0) {
      globalSearchResults.innerHTML = '';
      globalSearchResults.classList.remove('is-visible');
      if (searchFeedback) {
        searchFeedback.textContent = '';
        searchFeedback.classList.remove('is-visible');
      }
      return;
    }

    const matches = [];
    globalSearchIndex.forEach(item => {
      const combinedText = `${item.title} ${item.page} ${item.text}`;
      const normalizedText = normalizeSearch(combinedText);
      if (!terms.every(term => normalizedText.includes(term))) return;

      // Search the actual section copy first, then its title/page metadata.
      // Every displayed result must visibly contain the user's search term.
      let snippets = buildMatchSnippets(item.text, raw);
      if (!snippets.length) snippets = buildMatchSnippets(`${item.title} — ${item.page}`, raw, 1);

      snippets.forEach((snippet, occurrenceIndex) => {
        matches.push({ ...item, snippet, occurrenceIndex });
      });
    });

    const visibleMatches = matches.slice(0, 24);
    globalSearchResults.innerHTML = visibleMatches.length
      ? visibleMatches.map(item => `
        <a class="global-search-result" role="option" href="${escapeHtml(resultUrl(item.url, raw))}">
          <span class="global-search-result__meta"><span>${escapeHtml(item.page)}</span><span>Open →</span></span>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${highlightMatch(item.snippet, terms)}</p>
        </a>`).join('')
      : '<div class="global-search-empty">No exact instances found.</div>';

    globalSearchResults.classList.add('is-visible');

    if (searchFeedback) {
      const count = matches.length;
      searchFeedback.textContent = `${count} instance${count === 1 ? '' : 's'} of “${raw}”`;
      searchFeedback.classList.add('is-visible');
    }
  }

  function highlightDashboardTarget() {
    const query = new URLSearchParams(window.location.search).get('q');
    if (!query || !window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    target.classList.add('search-target-highlight');
    setTimeout(() => target.classList.remove('search-target-highlight'), 2600);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function updateSidebarToggle() {
    if (!collapseSidebarButton) return;
    const isCollapsed = body.classList.contains('sidebar-collapsed');
    const icon = collapseSidebarButton.querySelector('.sidebar-toggle__icon');
    const label = collapseSidebarButton.querySelector('.sidebar-toggle__label');

    collapseSidebarButton.setAttribute('aria-expanded', String(!isCollapsed));
    collapseSidebarButton.setAttribute('aria-label', isCollapsed ? 'Expand navigation' : 'Collapse navigation');
    collapseSidebarButton.title = isCollapsed ? 'Expand navigation' : 'Collapse navigation';
    if (icon) icon.textContent = isCollapsed ? '›' : '‹';
    if (label) label.textContent = isCollapsed ? 'Expand navigation' : 'Collapse navigation';
  }

  function updateProgress() {
    const baseProgress = 0;
    const taskContribution = taskCheckboxes.length
      ? Math.round((state.completedTasks / taskCheckboxes.length) * 20)
      : 0;
    const progress = Math.min(100, baseProgress + taskContribution);

    const sidebarLabel = document.getElementById('sidebarProgressLabel');
    const sidebarBar = document.getElementById('sidebarProgressBar');
    const heroLabel = document.getElementById('heroProgressLabel');
    const summaryRing = document.querySelector('.summary-ring');
    const openDeliverables = document.getElementById('openDeliverables');
    const deliverableStatus = document.querySelector('#taskList')?.closest('.panel')?.querySelector('.status-pill');
    const remainingDeliverables = taskCheckboxes.length - state.completedTasks;

    if (sidebarLabel) sidebarLabel.textContent = `${progress}%`;
    if (sidebarBar) sidebarBar.style.width = `${progress}%`;
    if (heroLabel) heroLabel.textContent = `${progress}%`;
    if (summaryRing) summaryRing.style.setProperty('--progress', progress);
    if (openDeliverables) openDeliverables.textContent = remainingDeliverables;
    if (deliverableStatus) deliverableStatus.textContent = `${remainingDeliverables} open`;
  }

  function normalizeSearch(value) {
    return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function applyFilters() {
    const term = normalizeSearch(searchInput?.value || '');
    const terms = term ? term.split(' ') : [];
    let visibleCount = 0;

    searchableItems.forEach(item => {
      const searchableText = normalizeSearch(`${item.dataset.search || ''} ${item.textContent || ''}`);
      const matchesSearch = terms.length === 0 || terms.every(word => searchableText.includes(word));
      const hiddenByStatus = state.hideCompleted && item.classList.contains('session-card') && item.classList.contains('is-complete');
      const shouldHide = !matchesSearch || hiddenByStatus;
      item.classList.toggle('is-hidden', shouldHide);
      if (!shouldHide) visibleCount += 1;
    });

    clearSearchButton?.classList.toggle('is-visible', Boolean(term));
    if (searchFeedback) {
      searchFeedback.textContent = term
        ? `${visibleCount} matching item${visibleCount === 1 ? '' : 's'} for “${searchInput.value.trim()}”`
        : '';
      searchFeedback.classList.toggle('is-visible', Boolean(term));
    }
  }

  openSidebarButton?.addEventListener('click', () => body.classList.toggle('sidebar-open'));

  collapseSidebarButton?.addEventListener('click', () => {
    if (window.innerWidth <= 980) {
      body.classList.remove('sidebar-open');
      return;
    }
    body.classList.toggle('sidebar-collapsed');
    updateSidebarToggle();
  });

  sidebar?.addEventListener('click', event => {
    const navLink = event.target.closest('.nav-item');
    if (!navLink) return;

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('is-active'));
    navLink.classList.add('is-active');
    if (window.innerWidth <= 980) body.classList.remove('sidebar-open');
  });

  function resetSearch({ keepFocus = false } = {}) {
    if (!searchInput) return;
    searchInput.value = '';
    searchableItems.forEach(item => item.classList.remove('is-hidden'));
    renderGlobalSearch();
    if (keepFocus) searchInput.focus();
  }

  // Search is an application-wide navigation overlay. It does not filter or
  // remove dashboard modules while the user types.
  searchInput?.addEventListener('input', renderGlobalSearch);
  searchInput?.addEventListener('focus', renderGlobalSearch);
  searchInput?.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      resetSearch();
      searchInput.blur();
    }
    if (event.key === 'Enter') {
      globalSearchResults?.querySelector('.global-search-result')?.click();
    }
  });
  clearSearchButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    resetSearch({ keepFocus: true });
  });
  // Search results are real links. Do not cancel their default navigation.
  // The earlier implementation intercepted the click and attempted to route it
  // manually, which was unreliable when the application was opened directly
  // from the local file system. Native anchor navigation works for both local
  // files and hosted copies of the application.
  globalSearchResults?.addEventListener('pointerdown', event => {
    if (event.target.closest('.global-search-result')) {
      event.stopPropagation();
    }
  });

  globalSearchResults?.addEventListener('click', event => {
    const result = event.target.closest('.global-search-result');
    if (!result) return;
    // Let the browser follow the anchor. This intentionally has no
    // preventDefault() call.
    event.stopPropagation();
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.search, #globalSearchResults, .global-search-results')) return;
    resetSearch();
  });



  taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      checkbox.closest('.task-item')?.classList.toggle('is-complete', checkbox.checked);
      state.completedTasks = taskCheckboxes.filter(item => item.checked).length;
      updateProgress();
      showToast(checkbox.checked ? 'Deliverable marked complete' : 'Deliverable reopened');
    });
  });

  document.querySelectorAll('.session-card button.text-button, .resource-item[href="#"]').forEach(control => {
    control.addEventListener('click', event => {
      event.preventDefault();
      showToast('This module will be connected in a future milestone.');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) body.classList.remove('sidebar-open');
  });

  updateSidebarToggle();
  updateProgress();
  highlightDashboardTarget();
});
