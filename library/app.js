(function () {
  const app = document.getElementById('app');
  const libraryData = window.PORTAL_LIBRARY_DATA;
  const projectLoadPromises = new Map();
  const PROJECT_DATA_COS_BASE = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E9%A1%B9%E7%9B%AE%E6%95%B0%E6%8D%AE';
  const PROJECT_FETCH_TIMEOUT_MS = 4500;
  const PROJECT_FETCH_RETRY_DELAY_MS = 350;
  const GALLERY_BATCH_SIZE = 48;
  let routeRequestId = 0;
  let data;
  let deletedDesignStorageKey;
  let groupRenameStorageKey;
  let groupAssignmentStorageKey;
  let groupOrderStorageKey;
  let groupItemOrderStorageKey;
  let deletedDesignMetaStorageKey;
  const DEFAULT_GROUP_ID = '__default__';
  const libraryCategoryOrderStorageKey = 'portal-library-category-order:v1';
  const libraryProjectOrderStorageKey = 'portal-library-project-order:v1';
  const libraryProjectAssignmentStorageKey = 'portal-library-project-assignments:v1';
  const libraryRenameStorageKey = 'portal-library-renames:v1';
  const deletedLibraryProjectsStorageKey = 'portal-library-deleted-projects:v1';
  const favoriteLibraryProjectsStorageKey = 'portal-library-favorite-projects:v1';
  const recentProjectsStorageKey = 'portal-recent-projects:v1';
  const colorThemeStorageKey = 'portal-color-theme:v1';
  const titleCardCleanupMarkerKey = 'portal-title-card-cleanup:v1';
  const MAX_RECENT_PROJECTS = 6;
  const RECENT_PROJECT_HISTORY_LIMIT = MAX_RECENT_PROJECTS + 1;
  const initialSearchParams = new URLSearchParams(location.search);
  const enteredFromPortfolio = initialSearchParams.get('entry') === 'portfolio';
  let viewMode = initialSearchParams.get('mode') === 'immersive'
    ? 'immersive'
    : 'traditional';
  let immersiveParticleCleanup;
  let immersiveCursorCleanup;
  const libraryState = {
    rootId: 'digital-portal',
    categoryId: 'all',
    query: '',
    renames: loadLibraryRenames(),
    scrollPosition: { main: 0, tree: 0 },
    restoreScrollOnReturn: false,
    immersiveScrollPositions: {},
    restoreImmersiveScrollRootId: null
  };
  let state;
  let cardObserver;
  let galleryLoadObserver;
  let masonryObserver;
  let masonryLayoutFrame;
  let librarySwitchTimer;
  let pendingLibraryRootExpansion;
  let librarySearchComposing = false;
  let libraryProjectAssignments = loadLibraryProjectAssignments();
  let deletedLibraryProjects = loadDeletedLibraryProjects();
  let favoriteLibraryProjects = loadFavoriteLibraryProjects();
  let colorTheme = loadColorTheme();
  document.documentElement.dataset.theme = colorTheme;
  let draggedLibraryCategory;
  let suppressLibraryCategoryClickUntil = 0;
  let draggedLibraryProject;
  let suppressLibraryProjectClickUntil = 0;
  let focusTimer;
  let draggedDesign;
  let draggedGroup;
  let groupLongPressTimer;
  let groupLongPressController;
  let armedGroupSection;
  let suppressGroupClickUntil = 0;
  let designLongPressTimer;
  let designLongPressController;
  let armedDesignCard;
  let suppressDesignOpenUntil = 0;
  let suppressedDesignIndex;
  const projectDesignCount = project => Number.isFinite(project?.designCount)
    ? project.designCount
    : (Array.isArray(project?.designs) ? project.designs.length : 0);
  const projectContentCountText = project => `${projectDesignCount(project)} ${Number(project?.videoCount) > 0 ? '项内容' : '张设计稿'}`;

  const wait = duration => new Promise(resolve => setTimeout(resolve, duration));

  async function fetchProjectPayload(url, attempts = 1) {
    let lastError;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), PROJECT_FETCH_TIMEOUT_MS);
      try {
        const target = new URL(url, location.href);
        const response = await fetch(target, {
          credentials: target.origin === location.origin ? 'same-origin' : 'omit',
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`设计稿数据加载失败（${response.status}）`);
        const payload = await response.json();
        if (!Array.isArray(payload.designs)) throw new Error('设计稿数据格式不正确');
        return payload;
      } catch (error) {
        lastError = error;
        if (attempt + 1 < attempts) await wait(PROJECT_FETCH_RETRY_DELAY_MS * (attempt + 1));
      } finally {
        clearTimeout(timeout);
      }
    }
    if (lastError?.name === 'AbortError') throw new Error('设计稿数据加载超时');
    throw lastError || new Error('设计稿数据加载失败');
  }

  async function loadProjectDesigns(project) {
    if (Array.isArray(project.designs)) return project;
    if (!project.dataFile) throw new Error(`项目“${project.project}”缺少设计稿数据地址`);
    if (projectLoadPromises.has(project.id)) return projectLoadPromises.get(project.id);

    const version = encodeURIComponent(project.version || libraryData.version || 'latest');
    const cosDataFile = `${PROJECT_DATA_COS_BASE}/${encodeURIComponent(project.id)}.json?v=${version}`;
    const sources = [cosDataFile, project.dataFile, project.fallbackDataFile].filter((url, index, urls) => url && urls.indexOf(url) === index);
    const request = sources.reduce((previous, source, index) => previous.catch(() => fetchProjectPayload(source, index === 0 ? 2 : 1)), Promise.reject())
      .then(payload => {
        project.designs = payload.designs;
        project.designCount = payload.designs.length;
        project.videoCount = payload.designs.filter(isVideoDesign).length;
        return project;
      })
      .finally(() => projectLoadPromises.delete(project.id));

    projectLoadPromises.set(project.id, request);
    return request;
  }

  function renderProjectDataStatus(project, error = '') {
    const message = error || '正在加载项目设计稿';
    app.innerHTML = `
      <main class="project-data-status" role="status" aria-live="polite">
        <span class="project-data-status-mark" aria-hidden="true"></span>
        <strong>${escapeHtml(project?.project || '项目')}</strong>
        <p>${escapeHtml(message)}</p>
        ${error ? '<button type="button">重新加载</button>' : ''}
      </main>`;
    if (error) app.querySelector('button').onclick = route;
  }
  const icons = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8"></path><path d="M10 20h4"></path></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"></path></svg>',
    box: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 9h18"></path></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1A8 8 0 0 0 15 6l-.3-2.6h-4L10.4 6A8 8 0 0 0 8 7L5.6 6 3.7 9.5 5.8 11a7 7 0 0 0 0 2l-2.1 1.5L5.6 18 8 17a8 8 0 0 0 2.4 1l.3 2.6h4L15 18a8 8 0 0 0 2.4-1l2.4 1 2-3.5-2.1-1.5a7 7 0 0 0 .3-1z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7"></path><path d="M10 11v6m4-6v6"></path></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path></svg>',
    pencil: '<svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"></path><circle cx="3.5" cy="6" r="1"></circle><circle cx="3.5" cy="12" r="1"></circle><circle cx="3.5" cy="18" r="1"></circle></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v6M12 7h.01"></path></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>',
    panelsTopLeft: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18M9 21V9"></path></svg>',
    stethoscope: '<svg viewBox="0 0 24 24"><path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v3a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>',
    creditCard: '<svg viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"></rect><path d="M2 10h20"></path></svg>',
    package: '<svg viewBox="0 0 24 24"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5M12 22V12"></path></svg>',
    mapPinned: '<svg viewBox="0 0 24 24"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path><circle cx="12" cy="8" r="2"></circle><path d="m8.8 14.7-5.3 2.1a1 1 0 0 0-.5.9v3a1 1 0 0 0 1.4.9l7.6-3 7.6 3a1 1 0 0 0 1.4-.9v-3a1 1 0 0 0-.6-.9l-5.2-2.1"></path></svg>',
    badgeCreditCard: '<svg viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="5" rx="2"></rect><path d="M3 10h18M7 15h2M11 15h3"></path></svg>',
    monitor: '<svg viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>',
    presentation: '<svg viewBox="0 0 24 24"><path d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5"></path></svg>',
    server: '<svg viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><path d="M6 6h.01M6 18h.01"></path></svg>',
    image: '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"></path></svg>',
    video: '<svg viewBox="0 0 24 24"><rect width="18" height="16" x="3" y="4" rx="2"></rect><path d="m10 9 5 3-5 3Z"></path></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"></path></svg>',
    pause: '<svg viewBox="0 0 24 24"><rect x="7" y="5" width="3" height="14" rx="1"></rect><rect x="14" y="5" width="3" height="14" rx="1"></rect></svg>',
    volume: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4Z"></path><path d="M15 9.5a4 4 0 0 1 0 5M18 7a7 7 0 0 1 0 10"></path></svg>',
    volumeOff: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4Z"></path><path d="m16 9 5 5m0-5-5 5"></path></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"></path></svg>',
    panelLeftClose: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 3v18m7-6-3-3 3-3"></path></svg>',
    panelLeftOpen: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 3v18m4-12 3 3-3 3"></path></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>',
    chevronRight: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg>',
    arrowDownRight: '<svg viewBox="0 0 24 24"><path d="m7 7 10 10"></path><path d="M17 7v10H7"></path></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20.9 15.1A9 9 0 0 1 8.9 3.1 9 9 0 1 0 20.9 15.1Z"></path></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>',
    fileText: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6M8 13h8M8 17h6"></path></svg>',
    history: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5M12 7v5l3 2"></path></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"></path></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>',
    maximize: '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"></path></svg>',
    rotateCcw: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg>'
  };
  const icon = name => {
    const svg = icons[name].replace(/<(path|rect|circle|line|polyline|polygon)\b/g, '<$1 pathLength="1"');
    return `<span class="icon">${svg}</span>`;
  };
  const brandLogoMarkup = () => `
    <a class="eux-brand-logo brand-focus-link" href="./index.html${viewMode === 'immersive' ? '?mode=immersive' : ''}#library" aria-label="返回项目库首页" title="返回项目库首页">
      <img class="eux-brand-logo-light" src="./eux-design-logo-light.svg?v=20261016164000" alt="">
      <img class="eux-brand-logo-dark" src="./eux-design-logo-dark.svg?v=20261016164000" alt="">
    </a>`;
  const collaborationBrandMarkup = () => `${brandLogoMarkup()}<span class="immersive-collab-mark" aria-hidden="true">×</span><a class="decolas-brand brand-focus-link" href="../#home" aria-label="返回个人站首页" title="返回个人站首页"><strong>Decolas</strong><span>Design</span></a>`;
  const themeToggleMarkup = () => {
    const light = colorTheme === 'light';
    const label = light ? '切换深色模式' : '切换浅色模式';
    return `<button class="theme-toggle" type="button" aria-label="${label}" title="${label}">${icon(light ? 'moon' : 'sun')}</button>`;
  };

  const modeToggleMarkup = () => {
    const immersive = viewMode === 'immersive';
    const label = immersive ? '切换传统版' : '切换沉浸版';
    return `<button class="mode-toggle${immersive ? '' : ' mode-toggle-featured'}" type="button" aria-label="${label}" title="${label}">${icon(immersive ? 'grid' : 'maximize')}<span>${immersive ? '传统版' : '沉浸版'}</span></button>`;
  };

  function applyViewMode(mode) {
    viewMode = mode === 'immersive' ? 'immersive' : 'traditional';
    const url = new URL(location.href);
    if (viewMode === 'immersive') url.searchParams.set('mode', 'immersive');
    else {
      url.searchParams.delete('mode');
      url.searchParams.delete('root');
    }
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    route();
  }

  function playImmersiveIntro(onCovered) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCovered();
      return;
    }
    document.querySelector('.immersive-intro')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'immersive-intro';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-label', '正在加载沉浸版');
    overlay.innerHTML = `
      <div class="immersive-intro-center">
        <span class="immersive-intro-mark" aria-hidden="true"><i></i></span>
      </div>
      <span class="immersive-intro-axis" aria-hidden="true"></span>
      <span class="immersive-intro-curtain" aria-hidden="true"></span>
      <div class="immersive-intro-word" aria-hidden="true">
        <strong>马上呈现</strong>
        <span class="immersive-intro-word-plate"></span>
        <span class="immersive-intro-word-accent"></span>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-active'));
    setTimeout(onCovered, 260);
    setTimeout(() => overlay.classList.add('is-complete'), 4050);
    setTimeout(() => overlay.remove(), 4920);
  }

  function finishInitialLibraryBoot() {
    const overlay = document.getElementById('library-boot');
    if (!overlay) return;

    const startedAt = Number(window.__libraryBootStartedAt) || performance.now();
    const minimumDuration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 3000;
    const dismiss = () => {
      const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));
      setTimeout(() => {
        overlay.classList.add('is-complete');
        setTimeout(() => overlay.remove(), 760);
      }, remaining);
    };

    if (window.__libraryStylesLoaded || document.getElementById('library-styles')?.sheet) dismiss();
    else addEventListener('library-styles-ready', dismiss, { once: true });
  }

  function setViewMode(mode) {
    const nextMode = mode === 'immersive' ? 'immersive' : 'traditional';
    if (nextMode === viewMode) return;
    applyViewMode(nextMode);
  }

  function bindModeToggle() {
    document.querySelectorAll('.mode-toggle').forEach(button => {
      button.onclick = () => setViewMode(viewMode === 'immersive' ? 'traditional' : 'immersive');
    });
  }

  function loadColorTheme() {
    try {
      const storedTheme = localStorage.getItem(colorThemeStorageKey);
      return storedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  function bindThemeToggle() {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    button.onclick = () => {
      colorTheme = colorTheme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = colorTheme;
      try { localStorage.setItem(colorThemeStorageKey, colorTheme); } catch {}
      const light = colorTheme === 'light';
      const label = light ? '切换深色模式' : '切换浅色模式';
      button.innerHTML = icon(light ? 'moon' : 'sun');
      button.setAttribute('aria-label', label);
      button.title = label;
      button.classList.remove('theme-toggle-pop');
      requestAnimationFrame(() => button.classList.add('theme-toggle-pop'));
      if (
        viewMode === 'immersive' &&
        (document.querySelector('.immersive-project-view') || matchMedia('(prefers-reduced-motion: reduce)').matches)
      ) {
        requestAnimationFrame(mountImmersiveParticles);
      }
    };
  }

  const rootIconName = rootId => ({
    'digital-portal': 'panelsTopLeft',
    'internet-medical': 'stethoscope',
    'medical-insurance': 'creditCard',
    'self-product': 'package',
    'regional-product': 'mapPinned',
    'electronic-card': 'badgeCreditCard',
    'large-screen': 'monitor',
    exhibition: 'presentation',
    backend: 'server'
  })[rootId] || 'folder';
  const productDocuments = [
    '中台相关系统.rp',
    '统一后台Ukey登录.rp',
    '后台统一门户V1.6.4.rp',
    '后台统一门户V1.6.2.rp',
    '后台统一门户V1.6.3.rp',
    '后台统一门户V1.6.1.rp',
    '后台统一门户V1.6.0.rp',
    '后台统一门户V1.0.4.rp',
    '统一运维平台V1.0.0.rp',
    '后台统一门户V1.0.3.rp',
    '后台统一门户V1.0.2.rp',
    '后台统一门户操作文档V1.0.0.docx',
    '后台统一门户V1.0.1.rp',
    '后台统一门户V1.0.0.rp'
  ];

  function categoryDisplayName(category) {
    return libraryState.renames.categories[String(category.id)] || (category.id === '507024' ? '根目录项目' : category.name);
  }

  function rootDisplayName(root) {
    return libraryState.renames.roots[String(root.id)] || root.name;
  }

  function loadLibraryRenames() {
    try {
      const stored = JSON.parse(localStorage.getItem(libraryRenameStorageKey) || '{}');
      const roots = stored?.roots && typeof stored.roots === 'object' && !Array.isArray(stored.roots) ? stored.roots : {};
      const categories = stored?.categories && typeof stored.categories === 'object' && !Array.isArray(stored.categories) ? stored.categories : {};
      return { roots, categories };
    } catch {
      return { roots: {}, categories: {} };
    }
  }

  function saveLibraryRenames() {
    try {
      localStorage.setItem(libraryRenameStorageKey, JSON.stringify(libraryState.renames));
    } catch {}
  }

  function loadDeletedLibraryProjects() {
    try {
      const stored = JSON.parse(localStorage.getItem(deletedLibraryProjectsStorageKey) || '[]');
      return new Set(Array.isArray(stored) ? stored.map(String) : []);
    } catch {
      return new Set();
    }
  }

  function saveDeletedLibraryProjects() {
    try {
      localStorage.setItem(deletedLibraryProjectsStorageKey, JSON.stringify([...deletedLibraryProjects]));
    } catch {}
  }

  function loadFavoriteLibraryProjects() {
    try {
      const savedFavorites = localStorage.getItem(favoriteLibraryProjectsStorageKey);
      const stored = savedFavorites === null
        ? libraryData.favoriteProjectIds || []
        : JSON.parse(savedFavorites);
      return new Set(Array.isArray(stored) ? stored.map(String) : []);
    } catch {
      return new Set((libraryData.favoriteProjectIds || []).map(String));
    }
  }

  function saveFavoriteLibraryProjects() {
    try {
      localStorage.setItem(favoriteLibraryProjectsStorageKey, JSON.stringify([...favoriteLibraryProjects]));
    } catch {}
  }

  function loadRecentProjectIds() {
    try {
      const stored = JSON.parse(localStorage.getItem(recentProjectsStorageKey) || '[]');
      return Array.isArray(stored)
        ? stored.filter(id => !deletedLibraryProjects.has(String(id)) && libraryData.projects.some(project => project.id === id && project.id !== 'backend-unified')).slice(0, RECENT_PROJECT_HISTORY_LIMIT)
        : [];
    } catch {
      return [];
    }
  }

  function recordRecentProject(projectId) {
    if (!projectId || projectId === 'backend-unified') return;
    const recent = [projectId, ...loadRecentProjectIds().filter(id => id !== projectId)].slice(0, RECENT_PROJECT_HISTORY_LIMIT);
    try {
      localStorage.setItem(recentProjectsStorageKey, JSON.stringify(recent));
    } catch {}
  }

  function loadLibraryCategoryOrder() {
    try {
      const stored = JSON.parse(localStorage.getItem(libraryCategoryOrderStorageKey) || '{}');
      return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
      return {};
    }
  }

  function orderedLibraryCategories(rootId) {
    const categories = libraryData.categories.filter(category => category.rootId === rootId);
    const savedOrder = loadLibraryCategoryOrder()[rootId];
    if (!Array.isArray(savedOrder)) return categories;
    const orderIndex = new Map(savedOrder.map((id, index) => [String(id), index]));
    return [...categories].sort((a, b) => {
      const aIndex = orderIndex.has(String(a.id)) ? orderIndex.get(String(a.id)) : Number.MAX_SAFE_INTEGER;
      const bIndex = orderIndex.has(String(b.id)) ? orderIndex.get(String(b.id)) : Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
  }

  function saveLibraryCategoryOrder(rootId, categoryIds) {
    const stored = loadLibraryCategoryOrder();
    stored[rootId] = categoryIds;
    try {
      localStorage.setItem(libraryCategoryOrderStorageKey, JSON.stringify(stored));
    } catch {}
  }

  function loadLibraryProjectOrder() {
    try {
      const stored = JSON.parse(localStorage.getItem(libraryProjectOrderStorageKey) || '{}');
      return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
      return {};
    }
  }

  function orderedLibraryProjects(rootId) {
    const projects = libraryData.projects.filter(project => project.rootId === rootId && !deletedLibraryProjects.has(String(project.id)));
    const savedOrder = loadLibraryProjectOrder()[rootId];
    const ordered = [...projects];
    if (Array.isArray(savedOrder)) {
      const orderIndex = new Map(savedOrder.map((id, index) => [String(id), index]));
      ordered.sort((a, b) => {
        const aIndex = orderIndex.has(String(a.id)) ? orderIndex.get(String(a.id)) : Number.MAX_SAFE_INTEGER;
        const bIndex = orderIndex.has(String(b.id)) ? orderIndex.get(String(b.id)) : Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex;
      });
    }
    return ordered.sort((a, b) => {
      return Number(favoriteLibraryProjects.has(String(b.id))) - Number(favoriteLibraryProjects.has(String(a.id)));
    });
  }

  function flattenedRootProject(root) {
    if (!root || root.navigation !== 'projects') return null;
    const projects = orderedLibraryProjects(root.id);
    if (projects.length !== 1) return null;
    const project = projects[0];
    return String(project.id) === String(root.id)
      || project.project.trim() === rootDisplayName(root).trim()
      ? project
      : null;
  }

  function saveLibraryProjectOrder(rootId, projectIds) {
    const stored = loadLibraryProjectOrder();
    stored[rootId] = projectIds;
    try {
      localStorage.setItem(libraryProjectOrderStorageKey, JSON.stringify(stored));
    } catch {}
  }

  function loadLibraryProjectAssignments() {
    try {
      const stored = JSON.parse(localStorage.getItem(libraryProjectAssignmentStorageKey) || '{}');
      return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
      return {};
    }
  }

  function libraryProjectCategoryId(project) {
    return String(libraryProjectAssignments[project.id] || project.categoryId);
  }

  function saveLibraryProjectAssignment(project, categoryId) {
    if (String(project.categoryId) === String(categoryId)) delete libraryProjectAssignments[project.id];
    else libraryProjectAssignments[project.id] = String(categoryId);
    try {
      localStorage.setItem(libraryProjectAssignmentStorageKey, JSON.stringify(libraryProjectAssignments));
    } catch {}
  }

  function clearLibraryCategoryDropState() {
    document.querySelector('.tree')?.classList.remove('is-sorting');
    document.querySelectorAll('.tree-filter').forEach(button => {
      button.classList.remove('is-dragging', 'category-drop-before', 'category-drop-after');
      button.setAttribute('aria-grabbed', 'false');
    });
  }

  function clearLibraryProjectDropState() {
    document.querySelector('.project-grid')?.classList.remove('is-sorting');
    document.querySelector('.tree')?.classList.remove('is-moving-project');
    document.querySelectorAll('.tree-filter.project-group-drop-target').forEach(button => button.classList.remove('project-group-drop-target'));
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.remove('is-dragging', 'project-drop-before', 'project-drop-after');
      card.setAttribute('aria-grabbed', 'false');
    });
  }

  function activateProject(projectId) {
    const nextProject = libraryData.projects.find(project => project.id === projectId && !deletedLibraryProjects.has(String(project.id)));
    if (!nextProject || !Array.isArray(nextProject.designs)) return false;
    recordRecentProject(nextProject.id);
    if (!libraryState.restoreScrollOnReturn && libraryState.rootId !== nextProject.rootId) {
      libraryState.rootId = nextProject.rootId;
      libraryState.categoryId = 'all';
      libraryState.query = '';
    }
    if (data?.id === nextProject.id && state) return true;
    data = nextProject;
    seedTitleCardDeletions(data);
    const storageScope = data.id === 'backend-unified'
      ? data.version
      : `${data.id}:${data.version || libraryData.version}`;
    deletedDesignStorageKey = `backend-portal-deleted-designs:${storageScope}`;
    groupRenameStorageKey = `backend-portal-group-renames:${storageScope}`;
    groupAssignmentStorageKey = `backend-portal-group-assignments:${storageScope}`;
    groupOrderStorageKey = `backend-portal-group-order:${storageScope}`;
    groupItemOrderStorageKey = `backend-portal-group-item-order:${storageScope}`;
    deletedDesignMetaStorageKey = `backend-portal-deleted-meta:${storageScope}`;
    state = {
      group: '全部',
      query: '',
      expandedGroups: new Set(),
      deletedDesigns: new Set(loadDeletedDesigns()),
      deletedDesignMeta: loadDeletedDesignMeta(),
      groupRenames: loadGroupRenames(),
      groupAssignments: loadGroupAssignments(),
      groupOrder: loadGroupOrder(),
      groupItemOrder: loadGroupItemOrder(),
      sidebarCollapsed: false,
      focusedDesign: null,
      productQuery: '',
      productDocument: 2,
      productPage: '修改记录',
      productZoom: 1,
      galleryKey: '',
      galleryLimit: GALLERY_BATCH_SIZE
    };
    return true;
  }

  function seedTitleCardDeletions(project) {
    const manifest = window.PORTAL_TITLE_CARD_DELETIONS;
    if (!project || !Array.isArray(project.designs) || !manifest?.version || !manifest.projects) return;
    const markerKey = `${titleCardCleanupMarkerKey}:${manifest.version}:${project.id}`;
    if (sessionStorage.getItem(markerKey)) return;
    const deletedAt = Date.now();
    const indexes = manifest.projects[project.id];
    if (Array.isArray(indexes) && indexes.length) {
      const storageScope = project.id === 'backend-unified'
        ? project.version
        : `${project.id}:${project.version || libraryData.version}`;
      const deletedKey = `backend-portal-deleted-designs:${storageScope}`;
      const metaKey = `backend-portal-deleted-meta:${storageScope}`;
      let storedIndexes = [];
      let storedMeta = {};
      try {
        const parsedIndexes = JSON.parse(sessionStorage.getItem(deletedKey) || '[]');
        const parsedMeta = JSON.parse(sessionStorage.getItem(metaKey) || '{}');
        if (Array.isArray(parsedIndexes)) storedIndexes = parsedIndexes.filter(Number.isFinite);
        if (parsedMeta && typeof parsedMeta === 'object' && !Array.isArray(parsedMeta)) storedMeta = parsedMeta;
      } catch {}
      const deletedIndexes = new Set(storedIndexes);
      indexes.forEach(index => {
        const design = project.designs.find(item => item.index === index);
        if (!design) return;
        deletedIndexes.add(index);
        if (!storedMeta[index]) {
          storedMeta[index] = {
            group: design.groups?.[0] || null,
            deletedAt
          };
        }
      });
      sessionStorage.setItem(deletedKey, JSON.stringify([...deletedIndexes]));
      sessionStorage.setItem(metaKey, JSON.stringify(storedMeta));
    }
    sessionStorage.setItem(markerKey, manifest.version);
  }

  function transitionLibrary(changeState, activeButton) {
    changeState();
    clearTimeout(librarySwitchTimer);
    const main = document.querySelector('.library-main');
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!main || reduceMotion) {
      library();
      return;
    }

    document.querySelectorAll('.tree-row.active').forEach(row => row.classList.remove('active', 'is-activating'));
    activeButton?.classList.add('active', 'is-activating');
    main.classList.remove('is-entering');
    main.classList.add('is-leaving');
    librarySwitchTimer = setTimeout(() => {
      librarySwitchTimer = null;
      library(true);
    }, 130);
  }

  function library(animate = false) {
    if (viewMode === 'immersive') {
      immersiveLibrary();
      return;
    }
    closeLibraryMenus();
    const restoreScroll = libraryState.restoreScrollOnReturn;
    const savedScrollPosition = { ...libraryState.scrollPosition };
    const expandingRootId = animate ? pendingLibraryRootExpansion : null;
    pendingLibraryRootExpansion = null;
    if (!animate) {
      clearTimeout(librarySwitchTimer);
      librarySwitchTimer = null;
    }
    cardObserver?.disconnect();
    const showAllRoots = libraryState.rootId === 'all';
    const showFavorites = libraryState.rootId === 'favorites';
    const activeRoot = showAllRoots || showFavorites
      ? null
      : libraryData.roots.find(root => root.id === libraryState.rootId) || libraryData.roots[0];
    const rootProjects = showAllRoots || showFavorites
      ? libraryData.roots
          .flatMap(root => orderedLibraryProjects(root.id))
          .filter(project => !showFavorites || favoriteLibraryProjects.has(String(project.id)))
      : orderedLibraryProjects(activeRoot.id);
    const activeCategories = activeRoot ? orderedLibraryCategories(activeRoot.id) : [];
    const activeRootName = showFavorites ? '精选' : activeRoot ? rootDisplayName(activeRoot) : '全部';
    const totalProjectCount = libraryData.projects.filter(project => !deletedLibraryProjects.has(String(project.id))).length;
    const favoriteProjectCount = libraryData.projects.filter(project => favoriteLibraryProjects.has(String(project.id)) && !deletedLibraryProjects.has(String(project.id))).length;
    document.title = `团队文件 · ${activeRootName}`;
    const normalizedQuery = libraryState.query.trim().toLocaleLowerCase('zh-CN');
    const visibleProjects = rootProjects.filter(project => {
      const inCategory = libraryState.categoryId === 'all' || libraryProjectCategoryId(project) === String(libraryState.categoryId);
      const matchesQuery = !normalizedQuery || project.project.toLocaleLowerCase('zh-CN').includes(normalizedQuery);
      return inCategory && matchesQuery;
    });
    const categoryCount = categoryId => rootProjects.filter(project => libraryProjectCategoryId(project) === String(categoryId)).length;
    const sectionTitle = showFavorites
      ? '精选项目'
      : showAllRoots || libraryState.categoryId === 'all'
      ? '全部项目'
      : categoryDisplayName(activeCategories.find(category => category.id === libraryState.categoryId) || { id: '', name: rootDisplayName(activeRoot) });
    const coverMarkup = project => {
      if (project.cover) return `<img class="cover-unified" src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.project)}封面" loading="lazy">`;
      if (project.coverVariant === 'generic') return '<div class="cover-generic" aria-hidden="true"></div>';
      if (project.coverVariant === 'components') return '<div class="cover-components" aria-hidden="true"><span class="cube">◇</span><span>Components</span></div>';
      return '<div class="project-cover-empty"><span>暂无设计稿</span></div>';
    };
    app.innerHTML = `
      <main class="library">
        <header class="library-topbar">
          <div class="brand">${collaborationBrandMarkup()}</div>
          <label class="global-search">${icon('search')}<input aria-label="搜索项目" placeholder="搜索${escapeHtml(activeRootName)}项目" value="${escapeHtml(libraryState.query)}"></label>
          <span class="library-total">${rootProjects.length} 个项目</span>
          ${modeToggleMarkup()}
          ${themeToggleMarkup()}
        </header>
        <div class="library-body">
          <aside class="tree-sidebar">
            <div class="tree">
              <button class="tree-row tree-root tree-all${showAllRoots ? ` active${animate ? ' is-activating' : ''}` : ''}" type="button" data-root-all aria-current="${showAllRoots ? 'page' : 'false'}">
                <span class="tree-root-icon">${icon('grid')}</span><span>全部</span><span class="tree-count">${totalProjectCount}</span>
              </button>
              <button class="tree-row tree-root tree-favorites${showFavorites ? ` active${animate ? ' is-activating' : ''}` : ''}" type="button" data-root-favorites aria-current="${showFavorites ? 'page' : 'false'}">
                <span class="tree-root-icon">${icon('heart')}</span><span>精选</span><span class="tree-count">${favoriteProjectCount}</span>
              </button>
              ${libraryData.roots.map(root => {
                const expanded = root.id === activeRoot?.id;
                const animateChildren = expanded && expandingRootId === root.id;
                const rootProjectItems = orderedLibraryProjects(root.id);
                const collapsesDuplicateProjectLevel = Boolean(flattenedRootProject(root));
                const children = root.navigation === 'categories'
                  ? activeCategories.map((category, index) => `
                      <div class="tree-row-shell tree-filter-shell tree-child-entry${libraryState.categoryId === category.id ? ' active' : ''}" style="--child-index:${Math.min(index, 7)}">
                        <button class="tree-row tree-filter project-mini${libraryState.categoryId === category.id ? ` active${animate ? ' is-activating' : ''}` : ''}" draggable="true" aria-grabbed="false" title="拖拽调整分组顺序" data-category="${escapeHtml(category.id)}" data-category-root="${escapeHtml(root.id)}">
                          <span class="tree-child-icon">${icon('folder')}</span><span>${escapeHtml(categoryDisplayName(category))}</span><span class="tree-count">${categoryCount(category.id)}</span>
                        </button>
                        <button class="tree-more" type="button" data-library-kind="category" data-library-id="${escapeHtml(category.id)}" aria-label="${escapeHtml(categoryDisplayName(category))} 更多操作" aria-haspopup="menu" aria-expanded="false" title="更多操作">${icon('more')}</button>
                      </div>`).join('')
                  : rootProjectItems.map((project, index) => `
                      <button class="tree-row tree-project project-mini tree-child-entry${project.coming ? ' coming' : ''}" style="--child-index:${Math.min(index, 7)}" data-project-id="${escapeHtml(project.id)}">
                        <span class="tree-child-icon">${icon('folder')}</span><span>${escapeHtml(project.project)}</span><span class="tree-count">${projectDesignCount(project)}</span>
                      </button>`).join('');
                return `
                  <div class="tree-row-shell tree-root-shell${expanded && libraryState.categoryId === 'all' ? ' active' : ''}">
                    <button class="tree-row tree-root${root.id === activeRoot?.id ? ' is-current-root' : ''}${root.id === activeRoot?.id && libraryState.categoryId === 'all' ? ` active${animate ? ' is-activating' : ''}` : ''}" data-root="${escapeHtml(root.id)}" aria-current="${root.id === activeRoot?.id ? 'page' : 'false'}">
                      <span class="tree-root-icon">${icon(rootIconName(root.id))}</span><span>${escapeHtml(rootDisplayName(root))}</span><span class="tree-count">${orderedLibraryProjects(root.id).length}</span>
                    </button>
                    <button class="tree-more" type="button" data-library-kind="root" data-library-id="${escapeHtml(root.id)}" aria-label="${escapeHtml(rootDisplayName(root))} 更多操作" aria-haspopup="menu" aria-expanded="false" title="更多操作">${icon('more')}</button>
                  </div>
                  ${expanded && !collapsesDuplicateProjectLevel ? `<div class="tree-children${animateChildren ? ' is-expanding' : ''}"><div class="tree-children-inner">${children}</div></div>` : ''}`;
              }).join('')}
            </div>
          </aside>
          <section class="library-main${animate ? ' is-entering' : ''}">
            <div class="library-section-title"><div><h1>${escapeHtml(sectionTitle)}</h1><span>${visibleProjects.length} 个项目</span></div></div>
            ${visibleProjects.length ? `<div class="project-grid">
              ${visibleProjects.map((project, index) => `
                <div class="project-card-shell">
                  <button class="project-card${project.coming ? ' coming' : ''}${animate ? ' filter-reveal' : ''}" data-project-id="${escapeHtml(project.id)}" draggable="${project.coming || showAllRoots || showFavorites ? 'false' : 'true'}" aria-grabbed="false"${animate ? ` style="--filter-order:${Math.min(index, 10)}"` : ''}>
                    <div class="project-cover">${coverMarkup(project)}
                    </div>
                    <div class="project-meta"><span class="project-symbol"></span><span class="project-name">${escapeHtml(project.project)}</span><span class="project-meta-tail"><span class="project-design-count">${projectDesignCount(project)}</span></span></div>
                  </button>
                  <button class="project-card-favorite${favoriteLibraryProjects.has(String(project.id)) ? ' is-favorite' : ''}" type="button" data-project-favorite-id="${escapeHtml(project.id)}" aria-label="${favoriteLibraryProjects.has(String(project.id)) ? '移出精选' : '加入精选'}" aria-pressed="${favoriteLibraryProjects.has(String(project.id))}" title="${favoriteLibraryProjects.has(String(project.id)) ? '移出精选' : '加入精选'}">${icon('heart')}</button>
                  <button class="project-card-more" type="button" data-project-menu-id="${escapeHtml(project.id)}" aria-label="${escapeHtml(project.project)} 更多操作" aria-haspopup="menu" aria-expanded="false" title="更多操作">${icon('more')}</button>
                </div>`).join('')}
            </div>` : `<div class="library-empty">${libraryState.query ? '没有找到匹配的项目' : showFavorites ? '还没有精选项目' : '该分类暂无项目'}</div>`}
          </section>
        </div>
      </main>`;
    bindThemeToggle();
    bindModeToggle();
    document.querySelectorAll('.tree-children.is-expanding').forEach(children => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        children.classList.remove('is-expanding');
        return;
      }
      const finishExpansion = event => {
        if (event.target !== children) return;
        children.classList.remove('is-expanding');
        children.removeEventListener('animationend', finishExpansion);
      };
      children.addEventListener('animationend', finishExpansion);
    });
    document.querySelector('.library').addEventListener('click', event => {
      if (!event.target.closest('.tree-more, .project-card-more')) closeLibraryMenus();
    });
    document.querySelectorAll('.tree-more').forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        openLibraryMenu(button, button.dataset.libraryKind, button.dataset.libraryId);
      };
    });
    document.querySelectorAll('.project-card-more').forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        openProjectCardMenu(button, button.dataset.projectMenuId);
      };
    });
    document.querySelectorAll('.project-card-favorite').forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const project = libraryData.projects.find(item => String(item.id) === String(button.dataset.projectFavoriteId));
        if (!project || deletedLibraryProjects.has(String(project.id))) return;
        const wasFavorite = favoriteLibraryProjects.has(String(project.id));
        const mainScrollTop = document.querySelector('.library-main')?.scrollTop || 0;
        if (wasFavorite) favoriteLibraryProjects.delete(String(project.id));
        else favoriteLibraryProjects.add(String(project.id));
        saveFavoriteLibraryProjects();
        closeLibraryMenus();
        library();
        requestAnimationFrame(() => {
          const main = document.querySelector('.library-main');
          if (main) main.scrollTop = mainScrollTop;
        });
        toast(wasFavorite ? `已将“${project.project}”移出精选` : `已将“${project.project}”加入精选`);
      };
    });
    document.querySelectorAll('[data-project-id]').forEach(card => {
      card.onclick = () => {
        if (card.classList.contains('project-card') && Date.now() < suppressLibraryProjectClickUntil) return;
        const selectedProject = libraryData.projects.find(project => project.id === card.dataset.projectId);
        if (selectedProject?.coming) {
          toast(`${selectedProject.project}尚未导入`);
          return;
        }
        libraryState.scrollPosition = {
          main: document.querySelector('.library-main')?.scrollTop || 0,
          tree: document.querySelector('.tree')?.scrollTop || 0
        };
        libraryState.restoreScrollOnReturn = true;
        location.hash = `#project/${card.dataset.projectId}`;
      };
    });
    const canTiltLibraryCards = matchMedia('(hover: hover) and (pointer: fine)').matches
      && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.project-card').forEach(card => {
      let tiltFrame = 0;
      let tiltRect = null;
      const resetTilt = () => {
        if (tiltFrame) cancelAnimationFrame(tiltFrame);
        tiltFrame = 0;
        tiltRect = null;
        card.classList.remove('is-tilting');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--tilt-lift', '0px');
        card.style.setProperty('--tilt-scale', '1');
        card.style.setProperty('--tilt-shadow-x', '0px');
        card.style.setProperty('--tilt-shadow-y', '14px');
      };
      if (canTiltLibraryCards) {
        card.onpointerenter = () => { tiltRect = card.getBoundingClientRect(); };
        card.onpointermove = event => {
          if (event.pointerType !== 'mouse' || draggedLibraryProject || card.classList.contains('is-dragging')) {
            resetTilt();
            return;
          }
          const rect = tiltRect || card.getBoundingClientRect();
          tiltRect = rect;
          const pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
          const pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
          if (tiltFrame) cancelAnimationFrame(tiltFrame);
          tiltFrame = requestAnimationFrame(() => {
            tiltFrame = 0;
            card.classList.add('is-tilting');
            card.style.setProperty('--tilt-x', `${(-pointerY * 4.5).toFixed(2)}deg`);
            card.style.setProperty('--tilt-y', `${(pointerX * 5.5).toFixed(2)}deg`);
            card.style.setProperty('--tilt-lift', '-4px');
            card.style.setProperty('--tilt-scale', '1.01');
            card.style.setProperty('--tilt-shadow-x', `${(-pointerX * 10).toFixed(1)}px`);
            card.style.setProperty('--tilt-shadow-y', `${(14 - pointerY * 3).toFixed(1)}px`);
          });
        };
        card.onpointerleave = resetTilt;
        card.onpointercancel = resetTilt;
      }
      card.ondragstart = event => {
        const selectedProject = libraryData.projects.find(project => project.id === card.dataset.projectId);
        if (!selectedProject || selectedProject.coming || showAllRoots || showFavorites) {
          event.preventDefault();
          return;
        }
        resetTilt();
        draggedLibraryProject = { id: selectedProject.id, rootId: selectedProject.rootId };
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', selectedProject.id);
        card.setAttribute('aria-grabbed', 'true');
        document.querySelector('.project-grid')?.classList.add('is-sorting');
        document.querySelector('.tree')?.classList.add('is-moving-project');
        requestAnimationFrame(() => card.classList.add('is-dragging'));
      };
      card.ondragover = event => {
        if (!draggedLibraryProject || draggedLibraryProject.rootId !== activeRoot?.id || draggedLibraryProject.id === card.dataset.projectId) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        document.querySelectorAll('.project-card.project-drop-before, .project-card.project-drop-after').forEach(target => {
          if (target !== card) target.classList.remove('project-drop-before', 'project-drop-after');
        });
        const rect = card.getBoundingClientRect();
        const singleColumn = (document.querySelector('.project-grid')?.clientWidth || 0) < 560;
        const after = singleColumn
          ? event.clientY >= rect.top + rect.height / 2
          : event.clientX >= rect.left + rect.width / 2;
        card.classList.toggle('project-drop-before', !after);
        card.classList.toggle('project-drop-after', after);
      };
      card.ondragleave = event => {
        if (!card.contains(event.relatedTarget)) card.classList.remove('project-drop-before', 'project-drop-after');
      };
      card.ondrop = event => {
        event.preventDefault();
        if (!draggedLibraryProject || draggedLibraryProject.rootId !== activeRoot?.id || draggedLibraryProject.id === card.dataset.projectId) return;
        const projectIds = orderedLibraryProjects(activeRoot.id).map(project => String(project.id));
        const nextOrder = projectIds.filter(id => id !== draggedLibraryProject.id);
        const targetIndex = nextOrder.indexOf(card.dataset.projectId);
        const insertIndex = targetIndex + (card.classList.contains('project-drop-after') ? 1 : 0);
        nextOrder.splice(insertIndex, 0, draggedLibraryProject.id);
        const mainScrollTop = document.querySelector('.library-main')?.scrollTop || 0;
        saveLibraryProjectOrder(activeRoot.id, nextOrder);
        suppressLibraryProjectClickUntil = Date.now() + 300;
        draggedLibraryProject = null;
        clearLibraryProjectDropState();
        library();
        requestAnimationFrame(() => {
          const main = document.querySelector('.library-main');
          if (main) main.scrollTop = mainScrollTop;
        });
      };
      card.ondragend = () => {
        suppressLibraryProjectClickUntil = Date.now() + 300;
        draggedLibraryProject = null;
        clearLibraryProjectDropState();
      };
    });
    document.querySelector('[data-root-all]').onclick = () => {
      if (showAllRoots) return;
      const button = document.querySelector('[data-root-all]');
      pendingLibraryRootExpansion = null;
      transitionLibrary(() => {
        libraryState.rootId = 'all';
        libraryState.categoryId = 'all';
        libraryState.query = '';
      }, button);
    };
    document.querySelector('[data-root-favorites]').onclick = () => {
      if (showFavorites) return;
      const button = document.querySelector('[data-root-favorites]');
      pendingLibraryRootExpansion = null;
      transitionLibrary(() => {
        libraryState.rootId = 'favorites';
        libraryState.categoryId = 'all';
        libraryState.query = '';
      }, button);
    };
    document.querySelectorAll('[data-root]').forEach(button => {
      button.onclick = () => {
        const nextRoot = button.dataset.root;
        const directProject = flattenedRootProject(libraryData.roots.find(root => root.id === nextRoot));
        if (directProject) {
          libraryState.rootId = nextRoot;
          libraryState.categoryId = 'all';
          libraryState.query = '';
          libraryState.restoreScrollOnReturn = false;
          location.hash = `#project/${directProject.id}`;
          return;
        }
        const isCurrentRoot = libraryState.rootId === nextRoot;
        if (isCurrentRoot && libraryState.categoryId === 'all') return;
        pendingLibraryRootExpansion = isCurrentRoot ? null : nextRoot;
        transitionLibrary(() => {
          libraryState.rootId = nextRoot;
          libraryState.categoryId = 'all';
          libraryState.query = '';
        }, button);
      };
    });
    document.querySelectorAll('[data-category]').forEach(button => {
      button.onclick = () => {
        if (Date.now() < suppressLibraryCategoryClickUntil) return;
        const nextCategory = button.dataset.category;
        if (libraryState.categoryId === nextCategory) return;
        pendingLibraryRootExpansion = null;
        transitionLibrary(() => {
          libraryState.categoryId = nextCategory;
        }, button);
      };
      button.ondragstart = event => {
        draggedLibraryCategory = {
          id: button.dataset.category,
          rootId: button.dataset.categoryRoot
        };
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', button.dataset.category);
        button.setAttribute('aria-grabbed', 'true');
        document.querySelector('.tree')?.classList.add('is-sorting');
        requestAnimationFrame(() => button.classList.add('is-dragging'));
      };
      button.ondragover = event => {
        if (draggedLibraryProject) {
          if (draggedLibraryProject.rootId !== button.dataset.categoryRoot) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
          document.querySelectorAll('.tree-filter.project-group-drop-target').forEach(target => {
            if (target !== button) target.classList.remove('project-group-drop-target');
          });
          button.classList.add('project-group-drop-target');
          return;
        }
        if (!draggedLibraryCategory || draggedLibraryCategory.rootId !== button.dataset.categoryRoot || draggedLibraryCategory.id === button.dataset.category) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        document.querySelectorAll('.tree-filter.category-drop-before, .tree-filter.category-drop-after').forEach(row => {
          if (row !== button) row.classList.remove('category-drop-before', 'category-drop-after');
        });
        const rect = button.getBoundingClientRect();
        button.classList.toggle('category-drop-before', event.clientY < rect.top + rect.height / 2);
        button.classList.toggle('category-drop-after', event.clientY >= rect.top + rect.height / 2);
      };
      button.ondragleave = event => {
        if (!button.contains(event.relatedTarget)) button.classList.remove('category-drop-before', 'category-drop-after', 'project-group-drop-target');
      };
      button.ondrop = event => {
        event.preventDefault();
        if (draggedLibraryProject) {
          event.stopPropagation();
          const movedProject = libraryData.projects.find(project => project.id === draggedLibraryProject.id);
          const targetCategory = libraryData.categories.find(category => category.rootId === button.dataset.categoryRoot && String(category.id) === String(button.dataset.category));
          if (!movedProject || !targetCategory || movedProject.rootId !== targetCategory.rootId) return;
          const sourceCategoryId = libraryProjectCategoryId(movedProject);
          if (sourceCategoryId === String(targetCategory.id)) {
            suppressLibraryProjectClickUntil = Date.now() + 300;
            suppressLibraryCategoryClickUntil = Date.now() + 300;
            draggedLibraryProject = null;
            clearLibraryProjectDropState();
            return;
          }
          const projectIds = orderedLibraryProjects(targetCategory.rootId).map(project => String(project.id));
          const nextOrder = projectIds.filter(id => id !== movedProject.id);
          nextOrder.push(movedProject.id);
          saveLibraryProjectAssignment(movedProject, targetCategory.id);
          saveLibraryProjectOrder(targetCategory.rootId, nextOrder);
          suppressLibraryProjectClickUntil = Date.now() + 300;
          suppressLibraryCategoryClickUntil = Date.now() + 300;
          draggedLibraryProject = null;
          clearLibraryProjectDropState();
          library();
          toast(`已移动到${categoryDisplayName(targetCategory)}`);
          return;
        }
        if (!draggedLibraryCategory || draggedLibraryCategory.rootId !== button.dataset.categoryRoot || draggedLibraryCategory.id === button.dataset.category) return;
        const categoryIds = orderedLibraryCategories(button.dataset.categoryRoot).map(category => String(category.id));
        const nextOrder = categoryIds.filter(id => id !== draggedLibraryCategory.id);
        const targetIndex = nextOrder.indexOf(button.dataset.category);
        const insertIndex = targetIndex + (button.classList.contains('category-drop-after') ? 1 : 0);
        nextOrder.splice(insertIndex, 0, draggedLibraryCategory.id);
        saveLibraryCategoryOrder(button.dataset.categoryRoot, nextOrder);
        suppressLibraryCategoryClickUntil = Date.now() + 250;
        draggedLibraryCategory = null;
        clearLibraryCategoryDropState();
        library();
      };
      button.ondragend = () => {
        suppressLibraryCategoryClickUntil = Date.now() + 250;
        draggedLibraryCategory = null;
        clearLibraryCategoryDropState();
      };
    });
    const searchInput = document.querySelector('.global-search input');
    const commitLibrarySearch = value => {
      const nextValue = String(value ?? '');
      if (nextValue === libraryState.query) return;
      libraryState.query = nextValue;
      library();
      const nextInput = document.querySelector('.global-search input');
      nextInput.focus();
      nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
    };
    const commitCurrentLibrarySearch = fallbackValue => {
      const currentInput = document.querySelector('.global-search input');
      commitLibrarySearch(currentInput?.value ?? fallbackValue);
    };
    searchInput.oncompositionstart = () => {
      librarySearchComposing = true;
    };
    searchInput.oncompositionend = event => {
      librarySearchComposing = false;
      const value = event.currentTarget.value;
      queueMicrotask(() => commitCurrentLibrarySearch(value));
    };
    searchInput.oninput = event => {
      if (event.isComposing || librarySearchComposing) return;
      if (event.target.value === libraryState.query) return;
      commitLibrarySearch(event.target.value);
    };
    searchInput.onkeydown = event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const value = event.currentTarget.value;
      if (event.isComposing || librarySearchComposing) {
        librarySearchComposing = false;
        setTimeout(() => commitCurrentLibrarySearch(value), 0);
        return;
      }
      commitLibrarySearch(value);
    };
    searchInput.onchange = event => {
      if (!librarySearchComposing) commitLibrarySearch(event.currentTarget.value);
    };
    if (restoreScroll) {
      requestAnimationFrame(() => {
        const main = document.querySelector('.library-main');
        const tree = document.querySelector('.tree');
        if (main) main.scrollTop = savedScrollPosition.main;
        if (tree) tree.scrollTop = savedScrollPosition.tree;
        libraryState.restoreScrollOnReturn = false;
      });
    }
  }

  function closeLibraryMenus() {
    document.querySelector('.library-context-menu')?.remove();
    document.querySelectorAll('.tree-row-shell.has-open-menu').forEach(row => row.classList.remove('has-open-menu'));
    document.querySelectorAll('.project-card-shell.has-open-menu').forEach(card => card.classList.remove('has-open-menu'));
    document.querySelectorAll('.tree-more[aria-expanded="true"], .project-card-more[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  }

  function libraryItem(kind, id) {
    return kind === 'root'
      ? libraryData.roots.find(root => String(root.id) === String(id))
      : libraryData.categories.find(category => String(category.id) === String(id));
  }

  function libraryItemDisplayName(kind, item) {
    return kind === 'root' ? rootDisplayName(item) : categoryDisplayName(item);
  }

  function openLibraryMenu(button, kind, id) {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    closeLibraryMenus();
    if (wasOpen) return;

    const menu = document.createElement('div');
    menu.className = 'group-context-menu library-context-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `<button class="group-menu-item library-menu-rename" type="button" role="menuitem">${icon('pencil')}<span>重命名</span></button>`;
    document.body.appendChild(menu);

    const buttonRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const preferredLeft = buttonRect.right + 8;
    const left = preferredLeft + menuRect.width <= innerWidth - 12
      ? preferredLeft
      : Math.max(12, buttonRect.left - menuRect.width - 8);
    const top = Math.min(innerHeight - menuRect.height - 12, Math.max(12, buttonRect.top - 6));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    button.setAttribute('aria-expanded', 'true');
    button.closest('.tree-row-shell').classList.add('has-open-menu');
    menu.querySelector('.library-menu-rename').onclick = () => {
      closeLibraryMenus();
      openRenameLibraryDialog(kind, id);
    };
  }

  function openProjectCardMenu(button, projectId) {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    closeLibraryMenus();
    if (wasOpen) return;

    const project = libraryData.projects.find(item => String(item.id) === String(projectId));
    if (!project || deletedLibraryProjects.has(String(project.id))) return;

    const menu = document.createElement('div');
    menu.className = 'group-context-menu library-context-menu project-card-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `<button class="group-menu-item group-menu-delete project-menu-delete" type="button" role="menuitem">${icon('trash')}<span>删除项目</span></button>`;
    document.body.appendChild(menu);

    const buttonRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const left = Math.min(innerWidth - menuRect.width - 12, Math.max(12, buttonRect.right - menuRect.width));
    const preferredTop = buttonRect.bottom + 7;
    const top = preferredTop + menuRect.height <= innerHeight - 12
      ? preferredTop
      : Math.max(12, buttonRect.top - menuRect.height - 7);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    button.setAttribute('aria-expanded', 'true');
    button.closest('.project-card-shell').classList.add('has-open-menu');
    menu.querySelector('.project-menu-delete').onclick = () => {
      closeLibraryMenus();
      openDeleteProjectDialog(project.id);
    };
  }

  function openDeleteProjectDialog(projectId) {
    const project = libraryData.projects.find(item => String(item.id) === String(projectId));
    if (!project || deletedLibraryProjects.has(String(project.id))) return;

    const dialog = document.createElement('div');
    dialog.className = 'group-dialog-backdrop';
    dialog.innerHTML = `
      <form class="group-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
        <div class="group-dialog-icon danger">${icon('trash')}</div>
        <h3 id="delete-project-title">删除“${escapeHtml(project.project)}”？</h3>
        <p class="group-dialog-copy">项目及其 ${projectContentCountText(project)}将从项目库中隐藏。</p>
        <div class="group-dialog-actions"><button class="dialog-cancel" type="button">取消</button><button class="dialog-primary danger" type="submit">删除项目</button></div>
      </form>`;
    document.body.appendChild(dialog);

    const close = () => dialog.remove();
    dialog.querySelector('.dialog-cancel').onclick = close;
    dialog.onclick = event => { if (event.target === dialog) close(); };
    dialog.querySelector('form').onsubmit = event => {
      event.preventDefault();
      const mainScrollTop = document.querySelector('.library-main')?.scrollTop || 0;
      deletedLibraryProjects.add(String(project.id));
      saveDeletedLibraryProjects();
      favoriteLibraryProjects.delete(String(project.id));
      saveFavoriteLibraryProjects();
      close();
      library();
      requestAnimationFrame(() => {
        const main = document.querySelector('.library-main');
        if (main) main.scrollTop = mainScrollTop;
      });
      toast(`已删除“${project.project}”`);
    };
    dialog.onkeydown = event => { if (event.key === 'Escape') close(); };
    requestAnimationFrame(() => dialog.querySelector('.dialog-primary').focus());
  }

  function openRenameLibraryDialog(kind, id) {
    const item = libraryItem(kind, id);
    if (!item) return;
    const dialog = document.createElement('div');
    dialog.className = 'group-dialog-backdrop';
    dialog.innerHTML = `
      <form class="group-dialog" role="dialog" aria-modal="true" aria-labelledby="rename-library-title">
        <div class="group-dialog-icon">${icon('pencil')}</div>
        <h3 id="rename-library-title">重命名分组</h3>
        <label class="group-dialog-field"><span>分组名称</span><input maxlength="30" autocomplete="off" value="${escapeHtml(libraryItemDisplayName(kind, item))}"></label>
        <p class="group-dialog-error" aria-live="polite"></p>
        <div class="group-dialog-actions"><button class="dialog-cancel" type="button">取消</button><button class="dialog-primary" type="submit">保存</button></div>
      </form>`;
    document.body.appendChild(dialog);
    const input = dialog.querySelector('input');
    const error = dialog.querySelector('.group-dialog-error');
    const close = () => dialog.remove();
    dialog.querySelector('.dialog-cancel').onclick = close;
    dialog.onclick = event => { if (event.target === dialog) close(); };
    dialog.querySelector('form').onsubmit = event => {
      event.preventDefault();
      const nextName = input.value.trim();
      const siblings = kind === 'root'
        ? libraryData.roots
        : libraryData.categories.filter(category => category.rootId === item.rootId);
      const duplicate = siblings.some(sibling => String(sibling.id) !== String(id) && libraryItemDisplayName(kind, sibling) === nextName);
      if (!nextName) {
        error.textContent = '请输入分组名称';
        input.focus();
        return;
      }
      if (duplicate) {
        error.textContent = '该分组名称已存在';
        input.focus();
        return;
      }
      const target = kind === 'root' ? libraryState.renames.roots : libraryState.renames.categories;
      target[String(id)] = nextName;
      saveLibraryRenames();
      close();
      library();
      toast(`已重命名为“${nextName}”`);
    };
    dialog.onkeydown = event => { if (event.key === 'Escape') close(); };
    requestAnimationFrame(() => { input.focus(); input.select(); });
  }

  const immersiveRootDescriptions = {
    'digital-portal': '门户、服务入口与用户端体验',
    'self-product': '自主产品、平台能力与创新实践',
    'internet-medical': '互联网诊疗与线上医疗服务',
    'medical-insurance': '医保服务、支付与经办场景',
    'regional-product': '区域医疗与城市级协同产品',
    'electronic-card': '电子健康卡与居民身份服务',
    'large-screen': '数据驾驶舱与可视化大屏',
    exhibition: '展厅展示与品牌空间体验',
    backend: '管理后台与业务支撑系统'
  };

  function currentImmersiveRoot() {
    const rootId = new URLSearchParams(location.search).get('root');
    return libraryData.roots.find(root => root.id === rootId) || null;
  }

  function rememberImmersiveRootScroll(rootId) {
    const scroller = document.querySelector('.immersive-root-view');
    if (!scroller || !rootId) return;
    libraryState.immersiveScrollPositions[String(rootId)] = scroller.scrollTop;
    libraryState.restoreImmersiveScrollRootId = String(rootId);
  }

  function restoreImmersiveRootScroll(rootId) {
    if (libraryState.restoreImmersiveScrollRootId !== String(rootId)) return;
    const scrollTop = libraryState.immersiveScrollPositions[String(rootId)] || 0;
    libraryState.restoreImmersiveScrollRootId = null;
    requestAnimationFrame(() => {
      const scroller = document.querySelector('.immersive-root-view');
      if (!scroller) return;
      scroller.scrollTop = scrollTop;
      requestAnimationFrame(() => { scroller.scrollTop = scrollTop; });
    });
  }

  function setImmersiveRoot(rootId, replace = false) {
    const url = new URL(location.href);
    if (rootId) url.searchParams.set('root', rootId);
    else url.searchParams.delete('root');
    const root = libraryData.roots.find(item => item.id === rootId);
    const directProject = flattenedRootProject(root);
    url.hash = directProject ? `#project/${encodeURIComponent(directProject.id)}` : '#library';
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    history[replace ? 'replaceState' : 'pushState'](null, '', nextUrl);
    libraryState.query = '';
    route();
  }

  function navigateImmersiveBreadcrumb(rootId = null) {
    const url = new URL(location.href);
    if (rootId) {
      url.searchParams.set('root', rootId);
      libraryState.restoreImmersiveScrollRootId = String(rootId);
    } else {
      url.searchParams.delete('root');
      libraryState.restoreImmersiveScrollRootId = null;
    }
    url.hash = '#library';
    history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    libraryState.query = '';
    route();
  }

  function immersiveCoverMarkup(project) {
    if (project.cover) return `<img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.project)}封面" loading="lazy">`;
    return `<span class="immersive-cover-placeholder">${icon(rootIconName(project.rootId))}</span>`;
  }

  function immersiveBreadcrumbMarkup(items = []) {
    if (!items.length) return '';
    return `<nav class="immersive-header-path" aria-label="面包屑导航">
      ${items.map((item, index) => {
        const separator = index ? '<span class="immersive-breadcrumb-separator" aria-hidden="true">/</span>' : '';
        if (item.current) return `${separator}<span class="immersive-breadcrumb-current" aria-current="page">${escapeHtml(item.label)}</span>`;
        const iconMarkup = index === 0 ? icon('chevronLeft') : '';
        const targetAttribute = item.rootId
          ? `data-immersive-breadcrumb-root="${escapeHtml(item.rootId)}"`
          : 'data-immersive-breadcrumb-home';
        return `${separator}<button class="immersive-breadcrumb-link${index === 0 ? ' immersive-back' : ''}" type="button" ${targetAttribute}>${iconMarkup}<span>${escapeHtml(item.label)}</span></button>`;
      }).join('')}
    </nav>`;
  }

  function bindImmersiveBreadcrumbs() {
    const home = document.querySelector('[data-immersive-breadcrumb-home]');
    if (home) home.onclick = () => navigateImmersiveBreadcrumb();
    document.querySelectorAll('[data-immersive-breadcrumb-root]').forEach(button => {
      button.onclick = () => navigateImmersiveBreadcrumb(button.dataset.immersiveBreadcrumbRoot);
    });
  }

  function navigateTraditionalBreadcrumb(rootId = null) {
    libraryState.rootId = rootId || 'all';
    libraryState.categoryId = 'all';
    libraryState.query = '';
    libraryState.restoreScrollOnReturn = false;
    const url = new URL(location.href);
    url.searchParams.delete('mode');
    url.searchParams.delete('root');
    url.hash = '#library';
    history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    route();
  }

  function traditionalBreadcrumbMarkup(rootId, rootName, projectName, collapseRoot = false) {
    return `<nav class="traditional-breadcrumb" aria-label="面包屑导航">
      <button class="traditional-breadcrumb-link" type="button" data-traditional-breadcrumb-home>项目主页</button>
      <span class="traditional-breadcrumb-separator" aria-hidden="true">/</span>
      ${collapseRoot ? '' : `<button class="traditional-breadcrumb-link" type="button" data-traditional-breadcrumb-root="${escapeHtml(rootId)}">${escapeHtml(rootName)}</button>
      <span class="traditional-breadcrumb-separator" aria-hidden="true">/</span>`}
      <span class="traditional-breadcrumb-current" aria-current="page" title="${escapeHtml(projectName)}">${escapeHtml(projectName)}</span>
    </nav>`;
  }

  function bindTraditionalBreadcrumbs() {
    const home = document.querySelector('[data-traditional-breadcrumb-home]');
    if (home) home.onclick = () => navigateTraditionalBreadcrumb();
    const root = document.querySelector('[data-traditional-breadcrumb-root]');
    if (root) root.onclick = () => navigateTraditionalBreadcrumb(root.dataset.traditionalBreadcrumbRoot);
  }

  function immersiveHeaderMarkup({ breadcrumbs = [], projectSearch = false } = {}) {
    return `
      <header class="immersive-header${projectSearch ? ' immersive-project-header' : ''}">
        <div class="immersive-header-leading">
          <span class="immersive-brand-lockup">
            ${collaborationBrandMarkup()}
          </span>
          ${immersiveBreadcrumbMarkup(breadcrumbs)}
        </div>
        <div class="immersive-header-actions">
          ${projectSearch
            ? `<label class="immersive-search immersive-design-search">${icon('search')}<input type="search" aria-label="搜索图片或视频名称" placeholder="搜索图片或视频" autocomplete="off" value="${escapeHtml(state.query)}"><button type="button" class="immersive-search-clear" aria-label="清空搜索" ${state.query ? '' : 'hidden'}>${icon('x')}</button></label>`
            : ''}
          ${modeToggleMarkup()}
          ${themeToggleMarkup()}
        </div>
      </header>`;
  }

  function immersiveLibrary() {
    cardObserver?.disconnect();
    masonryObserver?.disconnect();
    const requestedRootId = new URLSearchParams(location.search).get('root');
    const showFavorites = requestedRootId === 'favorites';
    const activeRoot = showFavorites ? null : currentImmersiveRoot();
    if (activeRoot) {
      libraryState.rootId = activeRoot.id;
      libraryState.categoryId = 'all';
    } else {
      libraryState.rootId = showFavorites ? 'favorites' : 'all';
      libraryState.categoryId = 'all';
    }
    const directProject = flattenedRootProject(activeRoot);
    if (directProject) {
      const url = new URL(location.href);
      url.hash = `#project/${encodeURIComponent(directProject.id)}`;
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      route();
      return;
    }
    document.title = showFavorites ? '精选项目 · 沉浸版' : activeRoot ? `${rootDisplayName(activeRoot)} · 项目` : '沉浸版 · 项目主页';

    if (!activeRoot && !showFavorites) {
      const favoriteProjectCount = libraryData.projects.filter(project => favoriteLibraryProjects.has(String(project.id)) && !deletedLibraryProjects.has(String(project.id))).length;
      const directoryEntries = [
        { id: 'favorites', name: '精选项目', projectCount: favoriteProjectCount, description: '收藏的重点项目与代表性设计' },
        ...libraryData.roots.map(root => {
          const projectCount = orderedLibraryProjects(root.id).length;
          return {
            id: root.id,
            name: rootDisplayName(root),
            projectCount,
            description: immersiveRootDescriptions[root.id] || `${projectCount} 个设计项目`
          };
        })
      ];
      app.innerHTML = `
        <main class="immersive-view immersive-directory">
          <div class="immersive-particle-field" aria-hidden="true"><canvas></canvas></div>
          ${immersiveHeaderMarkup()}
          <nav class="immersive-directory-list" aria-label="项目分类">
            ${directoryEntries.map((entry, index) => {
              const number = String(index + 1).padStart(2, '0');
              return `
                <button class="immersive-directory-row" type="button" data-immersive-root="${escapeHtml(entry.id)}">
                  <span class="immersive-row-meta"><i></i><strong>${entry.projectCount}</strong><small>PROJECTS</small></span>
                  <span class="immersive-row-index">${number} / ${String(directoryEntries.length).padStart(2, '0')}</span>
                  <span class="immersive-row-copy">
                    <strong>${escapeHtml(entry.name)}</strong>
                    <small>${escapeHtml(entry.description)}</small>
                  </span>
                  <span class="immersive-row-number" aria-hidden="true">${[...number].map(digit => `<span data-digit="${digit}">${digit}</span>`).join('')}</span>
                  <span class="immersive-row-arrow">${icon('arrowDownRight')}</span>
                </button>`;
            }).join('')}
          </nav>
        </main>`;
      bindThemeToggle();
      bindModeToggle();
      document.querySelectorAll('[data-immersive-root]').forEach(button => {
        button.onclick = () => setImmersiveRoot(button.dataset.immersiveRoot);
      });
      mountImmersiveParticles();
      return;
    }

    app.innerHTML = `
      <main class="immersive-view immersive-root-view">
        <div class="immersive-particle-field" aria-hidden="true"><canvas></canvas></div>
        ${immersiveHeaderMarkup({
          breadcrumbs: [
            { label: '项目主页' },
            { label: showFavorites ? '精选项目' : rootDisplayName(activeRoot), current: true }
          ]
        })}
        <section class="immersive-project-results" aria-live="polite"></section>
      </main>`;
    bindThemeToggle();
    bindModeToggle();
    bindImmersiveBreadcrumbs();
    renderImmersiveProjectResults(activeRoot, showFavorites);
    mountImmersiveParticles();
    restoreImmersiveRootScroll(showFavorites ? 'favorites' : activeRoot.id);
  }

  function renderImmersiveProjectResults(root, favoritesOnly = false) {
    const container = document.querySelector('.immersive-project-results');
    if (!container) return;
    const projects = favoritesOnly
      ? libraryData.projects.filter(project => favoriteLibraryProjects.has(String(project.id)) && !deletedLibraryProjects.has(String(project.id)))
      : orderedLibraryProjects(root.id);
    const listName = favoritesOnly ? '精选项目' : rootDisplayName(root);
    const listLabel = favoritesOnly ? listName : `${listName}项目`;
    container.innerHTML = projects.length ? `
      <div class="immersive-project-list" aria-label="${escapeHtml(listLabel)}">
        ${projects.map((project, index) => `
          <button class="immersive-project-list-row" type="button" data-project-id="${escapeHtml(project.id)}" style="--project-order:${Math.min(index, 12)}">
            <span class="immersive-project-list-index">${String(index + 1).padStart(2, '0')}</span>
            <strong class="immersive-project-list-title">${escapeHtml(project.project)}</strong>
            <span class="immersive-project-list-count">${projectContentCountText(project)}</span>
            <span class="immersive-project-list-open">查看项目 ${icon('arrowDownRight')}</span>
            <span class="immersive-project-list-preview" aria-hidden="true">${immersiveCoverMarkup(project)}</span>
          </button>`).join('')}
      </div>` : `<div class="immersive-empty">${favoritesOnly ? '还没有精选项目' : '暂无项目'}</div>`;
    container.querySelectorAll('[data-project-id]').forEach(button => {
      button.onclick = () => {
        rememberImmersiveRootScroll(favoritesOnly ? 'favorites' : root.id);
        location.hash = `#project/${button.dataset.projectId}`;
      };
    });
  }

  function bindHorizontalDragScroll(scroller) {
    if (!scroller) return;

    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragging = false;
    let suppressClick = false;
    const dragThreshold = 5;

    scroller.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = scroller.scrollLeft;
      dragging = false;
    });

    scroller.addEventListener('pointermove', event => {
      if (event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;
      if (!dragging && Math.abs(distance) < dragThreshold) return;
      if (!dragging) {
        dragging = true;
        scroller.classList.add('is-dragging');
        scroller.setPointerCapture(pointerId);
      }
      event.preventDefault();
      scroller.scrollLeft = startScrollLeft - distance;
    });

    const finishDragging = event => {
      if (event.pointerId !== pointerId) return;
      const activePointerId = pointerId;
      if (dragging) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      }
      scroller.classList.remove('is-dragging');
      pointerId = null;
      dragging = false;
      if (scroller.hasPointerCapture(activePointerId)) scroller.releasePointerCapture(activePointerId);
    };

    scroller.addEventListener('pointerup', finishDragging);
    scroller.addEventListener('pointercancel', finishDragging);
    scroller.addEventListener('lostpointercapture', finishDragging);
    scroller.addEventListener('pointerleave', event => {
      if (event.pointerId === pointerId && !dragging) pointerId = null;
    });
    scroller.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function immersiveProject() {
    if (state.group === '回收站') state.group = '全部';
    document.title = `${data.project} · 沉浸预览`;
    const groups = orderedGroups().filter(group => designsInGroup(group.name).length);
    const sourceRootId = new URLSearchParams(location.search).get('root');
    const breadcrumbRootId = sourceRootId === 'favorites' ? 'favorites' : data.rootId;
    const breadcrumbRoot = libraryData.roots.find(root => root.id === breadcrumbRootId);
    const breadcrumbRootName = breadcrumbRootId === 'favorites' ? '精选' : rootDisplayName(breadcrumbRoot || { id: data.rootId, name: data.rootId });
    const collapseRootBreadcrumb = breadcrumbRootId !== 'favorites' && flattenedRootProject(breadcrumbRoot)?.id === data.id;
    const breadcrumbs = collapseRootBreadcrumb
      ? [
          { label: '项目主页' },
          { label: data.project, current: true }
        ]
      : [
          { label: '项目主页' },
          { label: breadcrumbRootName, rootId: breadcrumbRootId },
          { label: data.project, current: true }
        ];
    app.innerHTML = `
      <main class="immersive-view immersive-project-view">
        <div class="immersive-particle-field" aria-hidden="true"><canvas></canvas></div>
        ${immersiveHeaderMarkup({
          breadcrumbs,
          projectSearch: true
        })}
        <nav class="immersive-group-nav" aria-label="页面分组">
          <button type="button" class="${state.group === '全部' ? 'active' : ''}" data-immersive-group="全部"><span>全部</span><small>${availableDesigns().length}</small></button>
          ${groups.map(group => `<button type="button" class="${state.group === group.name ? 'active' : ''}" data-immersive-group="${escapeHtml(group.name)}"><span>${escapeHtml(groupDisplayName(group.name))}</span><small>${designsInGroup(group.name).length}</small></button>`).join('')}
        </nav>
        <section class="immersive-gallery" id="immersive-gallery"></section>
      </main>`;
    bindThemeToggle();
    bindModeToggle();
    bindImmersiveBreadcrumbs();
    bindHorizontalDragScroll(document.querySelector('.immersive-group-nav'));
    document.querySelectorAll('[data-immersive-group]').forEach(button => {
      button.onclick = () => {
        state.group = button.dataset.immersiveGroup;
        document.querySelectorAll('[data-immersive-group]').forEach(item => item.classList.toggle('active', item === button));
        renderImmersiveGallery();
      };
    });
    const searchInput = document.querySelector('.immersive-design-search input');
    const clearButton = document.querySelector('.immersive-search-clear');
    let composing = false;
    const updateSearch = value => {
      const nextValue = String(value ?? '');
      clearButton.hidden = !nextValue;
      if (nextValue === state.query) return;
      state.query = nextValue;
      renderImmersiveGallery();
    };
    const commitCurrentSearch = () => updateSearch(searchInput.value);
    searchInput.oncompositionstart = () => { composing = true; };
    searchInput.oncompositionend = event => {
      composing = false;
      const value = event.currentTarget.value;
      queueMicrotask(() => updateSearch(searchInput?.value ?? value));
    };
    searchInput.oninput = event => {
      if (!composing && !event.isComposing) updateSearch(event.currentTarget.value);
    };
    searchInput.onkeydown = event => {
      if (event.key !== 'Enter') return;
      if (!event.isComposing && !composing) event.preventDefault();
      setTimeout(() => {
        composing = false;
        commitCurrentSearch();
      }, 0);
    };
    searchInput.onkeyup = event => {
      if (event.key !== 'Enter') return;
      composing = false;
      commitCurrentSearch();
    };
    searchInput.onchange = commitCurrentSearch;
    clearButton.onclick = event => {
      event.preventDefault();
      state.query = '';
      searchInput.value = '';
      clearButton.hidden = true;
      renderImmersiveGallery();
      searchInput.focus();
    };
    renderImmersiveGallery();
    mountImmersiveParticles();
  }

  function renderImmersiveGallery() {
    masonryObserver?.disconnect();
    cancelAnimationFrame(masonryLayoutFrame);
    const gallery = document.getElementById('immersive-gallery');
    if (!gallery) return;
    const list = filteredDesigns(state.group);
    const galleryKey = `${state.group}\n${state.query}`;
    if (state.galleryKey !== galleryKey) {
      state.galleryKey = galleryKey;
      state.galleryLimit = GALLERY_BATCH_SIZE;
    }
    const visibleList = list.slice(0, state.galleryLimit);
    const remainingCount = list.length - visibleList.length;
    gallery.innerHTML = `
      <div class="immersive-gallery-heading"><div><span class="immersive-kicker">DESIGN PAGES</span><h1>${escapeHtml(groupDisplayName(state.group))}</h1></div><span>${mediaCountText(list)}</span></div>
      ${list.length ? `<div class="masonry-grid immersive-masonry-grid">
        ${visibleList.map(design => `
          <div class="artboard-shell immersive-artboard reveal-pending" data-index="${design.index}">
            <button class="artboard-open" type="button" aria-label="预览 ${escapeHtml(design.name)}">
              ${designMediaMarkup(design)}
              <span class="artboard-meta"><span class="project-symbol"></span><span class="artboard-name">${escapeHtml(design.name)}</span></span>
            </button>
          </div>`).join('')}
      </div>${remainingCount > 0 ? '<div class="gallery-load-sentinel" role="status" aria-label="正在加载更多内容"><span aria-hidden="true"></span></div>' : ''}` : '<div class="immersive-empty">没有找到匹配的内容</div>'}`;
    const cards = [...gallery.querySelectorAll('.immersive-artboard')];
    observeMasonryGrid(gallery.querySelector('.masonry-grid'));
    cards.forEach(card => {
      card.querySelector('.artboard-open').onclick = () => openLightbox(Number(card.dataset.index));
    });
    observeGalleryAutoLoad(gallery, () => {
      state.galleryLimit += GALLERY_BATCH_SIZE;
      renderImmersiveGallery();
    });
    revealCards(cards);
  }

  function mountImmersiveParticles({
    staticMode = Boolean(document.querySelector('.immersive-project-view'))
  } = {}) {
    mountImmersiveCursor();
    immersiveParticleCleanup?.();
    immersiveParticleCleanup = null;
    const root = document.querySelector('.immersive-particle-field');
    const canvas = root?.querySelector('canvas');
    const context = canvas?.getContext('2d');
    if (!root || !canvas || !context) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame = 0;
    let lastDraw = 0;
    let lastMotion = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;
    let particles = [];
    let running = false;
    let dpr = Math.min(devicePixelRatio || 1, 1.5);
    let rootRect = root.getBoundingClientRect();
    let dark = document.documentElement.dataset.theme !== 'light';
    let colorValue = dark ? '242,244,245' : '16,18,23';
    const particleBuckets = Array.from({ length: 16 }, () => []);
    const updatePalette = () => {
      dark = document.documentElement.dataset.theme !== 'light';
      colorValue = dark ? '242,244,245' : '16,18,23';
    };
    const draw = time => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const frameScale = lastMotion ? Math.min(2.2, Math.max(.45, (time - lastMotion) / 16.67)) : 1;
      const damping = Math.pow(.94, frameScale);
      const radius = 154 + Math.sin(time / 520) * 8;
      const radiusSquared = radius * radius;
      lastMotion = time;
      context.clearRect(0, 0, width, height);
      particleBuckets.forEach(bucket => { bucket.length = 0; });
      particles.forEach(particle => {
        if (!staticMode && !reduceMotion && pointerActive) {
          const dx = particle.x - pointerX;
          const dy = particle.y - pointerY;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < radiusSquared && distanceSquared > .1) {
            const distance = Math.sqrt(distanceSquared);
            const force = Math.pow(1 - distance / radius, 1.55) * 2.75 * frameScale;
            particle.vx += dx / distance * force;
            particle.vy += dy / distance * force;
          }
        }
        if (!staticMode && !reduceMotion) {
          particle.vx += (particle.homeX - particle.x) * .018 * frameScale;
          particle.vy += (particle.homeY - particle.y) * .018 * frameScale;
          particle.vx *= damping;
          particle.vy *= damping;
          particle.x += particle.vx * frameScale;
          particle.y += particle.vy * frameScale;
        }
        const displacement = Math.min(1, Math.hypot(particle.x - particle.homeX, particle.y - particle.homeY) / 28);
        const displacementLevel = Math.min(7, Math.round(displacement * 7));
        particleBuckets[displacementLevel + particle.emphasis * 8].push(particle);
      });
      particleBuckets.forEach((bucket, bucketIndex) => {
        if (!bucket.length) return;
        const emphasis = bucketIndex >= 8 ? 1 : 0;
        const displacement = (bucketIndex % 8) / 7;
        const dotRadius = .8 + emphasis * .18 + displacement * .34;
        context.beginPath();
        bucket.forEach(particle => {
          context.moveTo(particle.x + dotRadius, particle.y);
          context.arc(particle.x, particle.y, dotRadius, 0, Math.PI * 2);
        });
        context.fillStyle = `rgba(${colorValue},${(dark ? .12 : .13) + emphasis * .05 + displacement * .11})`;
        context.fill();
      });
    };
    const resize = () => {
      rootRect = root.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rootRect.width * dpr);
      canvas.height = Math.round(rootRect.height * dpr);
      canvas.style.width = `${rootRect.width}px`;
      canvas.style.height = `${rootRect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const preferredSpacing = rootRect.width <= 620 ? 15 : 18;
      const spacing = Math.max(preferredSpacing, Math.sqrt(rootRect.width * rootRect.height / 14000));
      const columns = Math.ceil(rootRect.width / spacing) + 2;
      const rows = Math.ceil(rootRect.height / spacing) + 2;
      particles = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const homeX = column * spacing - spacing / 2;
          const homeY = row * spacing - spacing / 2;
          particles.push({ homeX, homeY, x: homeX, y: homeY, vx: 0, vy: 0, emphasis: (column + row) % 4 === 0 ? 1 : 0 });
        }
      }
      if (staticMode || reduceMotion) draw(0);
    };
    const animate = time => {
      if (!running) return;
      if (!lastDraw || time - lastDraw >= 16) {
        draw(time);
        lastDraw = time;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    const start = () => {
      if (staticMode || reduceMotion || running || document.hidden) return;
      running = true;
      lastDraw = 0;
      lastMotion = 0;
      animationFrame = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrame);
    };
    const onPointerMove = event => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      pointerX = event.clientX - rootRect.left;
      pointerY = event.clientY - rootRect.top;
      pointerActive = true;
    };
    const onPointerLeave = () => { pointerActive = false; };
    const onVisibility = () => { if (document.hidden) stop(); else start(); };
    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(updatePalette);
    resizeObserver.observe(root);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (!staticMode && !reduceMotion) {
      addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
    }
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    start();
    immersiveParticleCleanup = () => {
      stop();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }

  function mountImmersiveCursor() {
    immersiveCursorCleanup?.();
    immersiveCursorCleanup = null;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches || !document.querySelector('.immersive-view') || document.querySelector('.immersive-project-view')) return;

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cursor = document.createElement('div');
    cursor.className = 'immersive-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `
      <span class="immersive-cursor-shape">
        <i class="immersive-cursor-corner corner-tl"></i>
        <i class="immersive-cursor-corner corner-tr"></i>
        <i class="immersive-cursor-corner corner-br"></i>
        <i class="immersive-cursor-corner corner-bl"></i>
        <i class="immersive-cursor-dot"></i>
      </span>`;
    document.body.appendChild(cursor);
    document.documentElement.classList.add('immersive-cursor-active');

    let targetX = innerWidth / 2;
    let targetY = innerHeight / 2;
    let pointerTarget = null;
    let interactiveButton = null;
    let activeButton = null;
    let activeButtonRect = null;
    let frame = 0;
    let visible = false;
    const interactiveSelector = 'button:not(:disabled), a[href], [role="button"]';
    const largePreviewSelector = '.artboard-open, .immersive-directory-row, .immersive-project-list-row';

    const resetButton = button => {
      if (!button) return;
      button.style.setProperty('--button-magnet-x', '0px');
      button.style.setProperty('--button-magnet-y', '0px');
      button.classList.remove('is-magnetized');
    };
    const renderPointer = () => {
      frame = 0;

      const nextInteractiveButton = pointerTarget?.closest(interactiveSelector) || null;
      if (nextInteractiveButton !== interactiveButton) {
        interactiveButton = nextInteractiveButton;
        cursor.classList.toggle('is-interactive', Boolean(interactiveButton));
      }

      const nextMagneticButton = interactiveButton && !interactiveButton.matches(largePreviewSelector)
        ? interactiveButton
        : null;
      if (nextMagneticButton !== activeButton) {
        resetButton(activeButton);
        activeButton = nextMagneticButton;
        activeButtonRect = null;
      }
      if (activeButton) {
        const rect = activeButtonRect || activeButton.getBoundingClientRect();
        activeButtonRect = rect;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        cursor.classList.add('is-focused');
        cursor.style.width = `${rect.width + 20}px`;
        cursor.style.height = `${rect.height + 20}px`;
        cursor.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) translate(-50%, -50%)`;
        cursor.style.setProperty('--cursor-dot-x', `${targetX - centerX}px`);
        cursor.style.setProperty('--cursor-dot-y', `${targetY - centerY}px`);
      } else {
        cursor.classList.remove('is-focused');
        cursor.style.removeProperty('width');
        cursor.style.removeProperty('height');
        cursor.style.removeProperty('--cursor-dot-x');
        cursor.style.removeProperty('--cursor-dot-y');
        cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
      if (!activeButton || reduceMotion) return;

      const rect = activeButtonRect || activeButton.getBoundingClientRect();
      activeButtonRect = rect;
      const normalizedX = Math.max(-1, Math.min(1, (targetX - (rect.left + rect.width / 2)) / Math.max(rect.width / 2, 1)));
      const normalizedY = Math.max(-1, Math.min(1, (targetY - (rect.top + rect.height / 2)) / Math.max(rect.height / 2, 1)));
      const strength = Math.min(6, Math.max(3, Math.min(rect.width, rect.height) * .055));
      activeButton.classList.add('immersive-magnetic', 'is-magnetized');
      activeButton.style.setProperty('--button-magnet-x', `${normalizedX * strength}px`);
      activeButton.style.setProperty('--button-magnet-y', `${normalizedY * strength}px`);
    };
    const onPointerMove = event => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      pointerTarget = event.target instanceof Element ? event.target : null;
      if (!visible) {
        visible = true;
        cursor.classList.add('is-visible');
      }
      if (!frame) frame = requestAnimationFrame(renderPointer);
    };
    const onPointerDown = () => cursor.classList.add('is-pressed');
    const onPointerUp = () => cursor.classList.remove('is-pressed');
    const onViewportChange = () => {
      activeButtonRect = null;
      if (!frame) frame = requestAnimationFrame(renderPointer);
    };
    const onPointerLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      visible = false;
      cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed', 'is-focused');
      cursor.style.removeProperty('width');
      cursor.style.removeProperty('height');
      cursor.style.removeProperty('--cursor-dot-x');
      cursor.style.removeProperty('--cursor-dot-y');
      resetButton(activeButton);
      pointerTarget = null;
      interactiveButton = null;
      activeButton = null;
      activeButtonRect = null;
    };

    addEventListener('pointermove', onPointerMove, { passive: true });
    addEventListener('pointerdown', onPointerDown, { passive: true });
    addEventListener('pointerup', onPointerUp, { passive: true });
    addEventListener('resize', onViewportChange, { passive: true });
    addEventListener('scroll', onViewportChange, true);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    immersiveCursorCleanup = () => {
      cancelAnimationFrame(frame);
      resetButton(activeButton);
      removeEventListener('pointermove', onPointerMove);
      removeEventListener('pointerdown', onPointerDown);
      removeEventListener('pointerup', onPointerUp);
      removeEventListener('resize', onViewportChange);
      removeEventListener('scroll', onViewportChange, true);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.documentElement.classList.remove('immersive-cursor-active');
      cursor.remove();
    };
  }

  function project() {
    if (viewMode === 'immersive') {
      immersiveProject();
      return;
    }
    document.title = `${data.project} · 设计稿`;
    const currentRoot = libraryData.roots.find(root => root.id === data.rootId);
    const currentRootName = rootDisplayName(currentRoot || { id: data.rootId, name: data.rootId });
    const collapseRootBreadcrumb = flattenedRootProject(currentRoot)?.id === data.id;
    app.innerHTML = `
      <main class="project-view${state.sidebarCollapsed ? ' sidebar-collapsed' : ''}">
        <header class="project-header">
          <div class="project-header-leading">
            <div class="brand project-header-brand">${collaborationBrandMarkup()}</div>
            <div class="project-title">
              ${traditionalBreadcrumbMarkup(data.rootId, currentRootName, data.project, collapseRootBreadcrumb)}
            </div>
          </div>
          <div class="project-actions">
            <div class="project-search">
              ${icon('search')}
              <input id="design-search" type="search" aria-label="搜索图片或视频名称" placeholder="搜索图片或视频" autocomplete="off">
              <button class="search-clear" type="button" aria-label="清空搜索" title="清空搜索" ${state.query ? '' : 'hidden'}>${icon('x')}</button>
            </div>
            ${modeToggleMarkup()}
            ${themeToggleMarkup()}
          </div>
        </header>
        <div class="project-content">
          <aside class="group-panel">
            <div class="group-toolbar">
              <button class="show-all${state.group === '全部' ? ' active' : ''}" aria-label="显示全部设计稿">
                <span class="group-chevron">${icon('chevronDown')}</span>
                <strong>显示全部</strong>
                <span class="count">${availableDesigns().length}</span>
              </button>
              <button class="sidebar-toggle" aria-label="${state.sidebarCollapsed ? '展开分组栏' : '收起分组栏'}" title="${state.sidebarCollapsed ? '展开分组栏' : '收起分组栏'}">
                ${icon(state.sidebarCollapsed ? 'panelLeftOpen' : 'panelLeftClose')}
              </button>
            </div>
            <div class="group-list">${groupListMarkup()}</div>
            <div class="recycle-footer">
              <button class="recycle-button${state.group === '回收站' ? ' active' : ''}" type="button" aria-label="回收站">
                ${icon('trash')}<span class="recycle-label">回收站</span><span class="count">${state.deletedDesigns.size}</span>
              </button>
            </div>
          </aside>
          <div class="stage-viewport" id="viewport"><div class="stage" id="stage"></div></div>
        </div>
      </main>`;
    bindTraditionalBreadcrumbs();
    bindThemeToggle();
    bindModeToggle();
    document.querySelector('.project-view').addEventListener('click', event => {
      if (!event.target.closest('.artboard-actions')) closeArtboardMenus();
      if (!event.target.closest('.group-more')) closeGroupMenus();
    });
    document.querySelector('.show-all').onclick = () => {
      const groupChanged = state.group !== '全部';
      state.group = '全部';
      state.focusedDesign = null;
      document.querySelector('.show-all').classList.add('active');
      document.querySelector('.recycle-button').classList.remove('active');
      document.querySelectorAll('.group-row').forEach(row => row.classList.remove('active'));
      document.querySelectorAll('.group-child').forEach(child => child.classList.remove('active'));
      if (groupChanged) renderStage();
    };
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    sidebarToggle.onclick = () => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      document.querySelector('.project-view').classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
      const label = state.sidebarCollapsed ? '展开分组栏' : '收起分组栏';
      sidebarToggle.setAttribute('aria-label', label);
      sidebarToggle.title = label;
      sidebarToggle.innerHTML = icon(state.sidebarCollapsed ? 'panelLeftOpen' : 'panelLeftClose');
    };
    const searchInput = document.getElementById('design-search');
    const searchClear = document.querySelector('.search-clear');
    searchInput.value = state.query;
    searchInput.oninput = event => {
      state.query = event.target.value;
      state.focusedDesign = null;
      searchClear.hidden = !state.query;
      document.querySelectorAll('.group-child').forEach(child => child.classList.remove('active'));
      renderStage();
    };
    searchClear.onclick = () => {
      state.query = '';
      state.focusedDesign = null;
      searchInput.value = '';
      searchClear.hidden = true;
      document.querySelectorAll('.group-child').forEach(child => child.classList.remove('active'));
      renderStage();
      searchInput.focus();
    };
    bindGroupList();
    bindRecycleBin();
    renderStage();
  }

  function product() {
    cardObserver?.disconnect();
    document.title = '后台统一门户 · 产品';
    const visibleDocuments = productDocuments
      .map((name, index) => ({ name, index }))
      .filter(item => fuzzyMatch(item.name, state.productQuery));
    const activeDocument = productDocuments[state.productDocument];
    app.innerHTML = `
      <main class="project-view product-view">
        <header class="project-header">
          <div class="project-header-leading">
            <div class="brand project-header-brand">${collaborationBrandMarkup()}</div>
            <div class="project-title"><button class="back" aria-label="返回项目库">${icon('chevronLeft')}</button><span>后台统一门户</span></div>
          </div>
          <div class="project-actions">
            <div class="project-search">
              ${icon('search')}
              <input id="product-search" type="search" aria-label="搜索产品文档" placeholder="搜索产品文档" autocomplete="off">
              <button class="search-clear" type="button" aria-label="清空搜索" title="清空搜索" ${state.productQuery ? '' : 'hidden'}>${icon('x')}</button>
            </div>
            ${themeToggleMarkup()}
          </div>
        </header>
        <div class="product-content">
          <aside class="product-doc-panel">
            <div class="product-panel-title"><strong>文档</strong><span>${productDocuments.length}</span></div>
            <div class="product-doc-list">
              ${visibleDocuments.length ? visibleDocuments.map(item => `
                <button class="product-doc-row${item.index === state.productDocument ? ' active' : ''}" data-document="${item.index}" title="${item.name}">
                  ${icon('fileText')}<span>${item.name}</span>
                </button>`).join('') : '<div class="product-empty">没有匹配的文档</div>'}
            </div>
          </aside>
          <aside class="product-page-panel">
            <div class="product-panel-title"><strong>页面</strong></div>
            <nav class="product-page-list" aria-label="产品页面目录">
              ${productPageButton('修改记录', 'history')}
              ${productPageButton('维保期配置', 'fileText')}
              <div class="product-page-group">
                <div class="product-page-folder"><span class="group-chevron">${icon('chevronDown')}</span>${icon('folder')}<span>0615统一后台迭代</span></div>
                ${productPageButton('首页增加选择业务系统入口', 'fileText', true)}
              </div>
            </nav>
          </aside>
          <section class="product-preview">
            <div class="product-preview-bar">
              <div class="product-preview-name">${icon('fileText')}<span>${activeDocument}</span><small>${state.productPage}</small></div>
              <div class="product-zoom" aria-label="文档缩放">
                <button data-zoom="out" aria-label="缩小">${icon('minus')}</button>
                <span>${Math.round(state.productZoom * 100)}%</span>
                <button data-zoom="in" aria-label="放大">${icon('plus')}</button>
                <button data-zoom="reset" aria-label="恢复实际大小" title="恢复实际大小">${icon('maximize')}</button>
              </div>
            </div>
            <div class="product-preview-viewport">
              <div class="product-document" style="--product-zoom:${state.productZoom}">${productPreviewMarkup(activeDocument)}</div>
            </div>
          </section>
        </div>
      </main>`;

    document.querySelector('.back').onclick = () => { location.hash = '#library'; };
    bindThemeToggle();
    const searchInput = document.getElementById('product-search');
    const searchClear = document.querySelector('.search-clear');
    searchInput.value = state.productQuery;
    searchInput.oninput = event => {
      state.productQuery = event.target.value;
      product();
      const nextInput = document.getElementById('product-search');
      nextInput.focus();
      nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
    };
    searchClear.onclick = () => {
      state.productQuery = '';
      product();
      document.getElementById('product-search').focus();
    };
    document.querySelectorAll('[data-document]').forEach(button => button.onclick = () => {
      state.productDocument = Number(button.dataset.document);
      state.productPage = '修改记录';
      product();
    });
    document.querySelectorAll('[data-product-page]').forEach(button => button.onclick = () => {
      state.productPage = button.dataset.productPage;
      product();
    });
    document.querySelectorAll('[data-zoom]').forEach(button => button.onclick = () => {
      const action = button.dataset.zoom;
      state.productZoom = action === 'reset' ? 1 : Math.max(.7, Math.min(1.4, state.productZoom + (action === 'in' ? .1 : -.1)));
      product();
    });
  }

  function productPageButton(name, iconName, nested = false) {
    return `<button class="product-page-row${nested ? ' nested' : ''}${state.productPage === name ? ' active' : ''}" data-product-page="${name}">
      ${icon(iconName)}<span>${name}</span>
    </button>`;
  }

  function productPreviewMarkup(documentName) {
    if (state.productPage === '维保期配置') {
      return `
        <article class="product-sheet">
          <div class="sheet-kicker">${documentName}</div>
          <h1>维保期配置</h1>
          <p class="sheet-lead">统一配置后台产品的维保周期、到期提醒和服务状态。</p>
          <div class="setting-grid">
            <div><span>默认维保周期</span><strong>12 个月</strong></div>
            <div><span>到期提醒</span><strong>提前 30 天</strong></div>
            <div><span>到期后状态</span><strong>限制维护操作</strong></div>
            <div><span>适用范围</span><strong>全部业务系统</strong></div>
          </div>
        </article>`;
    }
    if (state.productPage === '首页增加选择业务系统入口') {
      return `
        <article class="product-sheet">
          <div class="sheet-kicker">0615统一后台迭代</div>
          <h1>首页增加选择业务系统入口</h1>
          <p class="sheet-lead">登录后台后，用户可根据权限快速进入对应的业务系统。</p>
          <div class="flow-line">
            <div><b>01</b><span>进入统一门户</span></div><i></i>
            <div><b>02</b><span>选择业务系统</span></div><i></i>
            <div><b>03</b><span>完成权限校验</span></div>
          </div>
          <h2>交互说明</h2>
          <ol class="sheet-list"><li>首页展示当前账号可访问的业务系统。</li><li>最近使用的系统优先排列，支持名称搜索。</li><li>无权限的系统不展示，权限变化后自动刷新。</li></ol>
        </article>`;
    }
    return `
      <article class="product-sheet">
        <div class="sheet-kicker">${documentName}</div>
        <h1>修改记录</h1>
        <p class="sheet-lead">原型历史记录</p>
        <div class="version-table" role="table" aria-label="版本修改记录">
          <div class="version-row version-head" role="row"><span>版本</span><span>序号</span><span>版本修改内容</span><span>修改类型</span><span>修改人</span><span>时间</span></div>
          <div class="version-row" role="row">
            <strong>V1.0</strong><span>2</span>
            <div class="version-content"><b>创建基础功能模块：</b><p>配置管理：登录鉴权、分组管理、操作员管理、权限管理、审计日志</p><p>业务管理：用户管理、卡信息、凭证信息管理、亲情关系管理</p><p>接入管理：开发者管理、开发者权限管理</p><p>运营管理：用户查询、问题管理</p><p>数据分析：概况分析、用户统计分析、电子卡运行分析</p></div>
            <span class="change-tag">新增</span><span>张璟</span><span>2020.07.03</span>
          </div>
        </div>
      </article>`;
  }

  function loadDeletedDesigns() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(deletedDesignStorageKey) || '[]');
      return Array.isArray(stored) ? stored.filter(Number.isFinite) : [];
    } catch {
      return [];
    }
  }
  function saveDeletedDesigns() {
    try {
      sessionStorage.setItem(deletedDesignStorageKey, JSON.stringify([...state.deletedDesigns]));
    } catch {}
  }
  function loadDeletedDesignMeta() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(deletedDesignMetaStorageKey) || '{}');
      return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
      return {};
    }
  }
  function saveDeletedDesignMeta() {
    try {
      sessionStorage.setItem(deletedDesignMetaStorageKey, JSON.stringify(state.deletedDesignMeta));
    } catch {}
  }
  function loadGroupRenames() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(groupRenameStorageKey) || '{}');
      return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
      return {};
    }
  }
  function saveGroupRenames() {
    try {
      sessionStorage.setItem(groupRenameStorageKey, JSON.stringify(state.groupRenames));
    } catch {}
  }
  function loadGroupAssignments() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(groupAssignmentStorageKey) || '{}');
      return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
      return {};
    }
  }
  function saveGroupAssignments() {
    try {
      sessionStorage.setItem(groupAssignmentStorageKey, JSON.stringify(state.groupAssignments));
    } catch {}
  }
  function loadGroupOrder() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(groupOrderStorageKey) || '[]');
      const knownGroups = data.groups.map(group => group.name);
      const validGroups = Array.isArray(stored) ? stored.filter(name => knownGroups.includes(name) || name === DEFAULT_GROUP_ID) : [];
      return [...new Set([...validGroups, ...knownGroups])];
    } catch {
      return data.groups.map(group => group.name);
    }
  }
  function saveGroupOrder() {
    try {
      sessionStorage.setItem(groupOrderStorageKey, JSON.stringify(state.groupOrder));
    } catch {}
  }
  function loadGroupItemOrder() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(groupItemOrderStorageKey) || '{}');
      if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
      const knownIndexes = new Set(data.designs.map(design => design.index));
      return Object.fromEntries(Object.entries(stored).map(([group, indexes]) => [
        group,
        Array.isArray(indexes) ? [...new Set(indexes.filter(index => Number.isFinite(index) && knownIndexes.has(index)))] : []
      ]));
    } catch {
      return {};
    }
  }
  function saveGroupItemOrder() {
    try {
      sessionStorage.setItem(groupItemOrderStorageKey, JSON.stringify(state.groupItemOrder));
    } catch {}
  }
  function orderedGroups() {
    const groupsByName = new Map(data.groups.map(group => [group.name, group]));
    if (state.groupOrder.includes(DEFAULT_GROUP_ID)) groupsByName.set(DEFAULT_GROUP_ID, { name: DEFAULT_GROUP_ID });
    return state.groupOrder.map(name => groupsByName.get(name)).filter(Boolean);
  }
  function groupDisplayName(groupName) {
    return state.groupRenames[groupName] || (groupName === DEFAULT_GROUP_ID ? '默认分组' : groupName);
  }
  function escapeHtml(value) {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, character => entities[character]);
  }
  const videoFilePattern = /\.(?:mp4|webm|ogv|ogg|mov|m4v)(?:[?#].*)?$/i;
  function designMediaSource(design) {
    return design?.videoSrc || design?.mediaSrc || design?.file || design?.src || '';
  }
  function isVideoDesign(design) {
    const declaredType = String(design?.mediaType || design?.type || design?.kind || '').toLocaleLowerCase('en-US');
    return declaredType === 'video' || videoFilePattern.test(designMediaSource(design));
  }
  function designPosterSource(design) {
    if (!isVideoDesign(design)) return design?.src || '';
    const source = designMediaSource(design);
    return design?.poster || design?.thumbnail || design?.cover || (design?.src && design.src !== source ? design.src : '');
  }
  function designAspectRatio(design) {
    const width = Number(design?.width);
    const height = Number(design?.height);
    return width > 0 && height > 0 ? `${width}/${height}` : '16/9';
  }
  function formatMediaDuration(duration) {
    if (typeof duration === 'string' && duration.trim()) return duration.trim();
    const totalSeconds = Math.max(0, Math.round(Number(duration) || 0));
    if (!totalSeconds) return '';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
  function designMediaMarkup(design) {
    const name = escapeHtml(design.name);
    const ratio = designAspectRatio(design);
    if (!isVideoDesign(design)) {
      return `<span class="artboard-media" style="aspect-ratio:${ratio}"><img loading="lazy" src="${escapeHtml(design.src)}" alt="${name}"></span>`;
    }
    const poster = designPosterSource(design);
    const duration = formatMediaDuration(design.duration);
    return `<span class="artboard-media is-video" style="aspect-ratio:${ratio}">
      ${poster ? `<img loading="lazy" src="${escapeHtml(poster)}" alt="${name} 视频封面">` : `<span class="artboard-video-placeholder">${icon('video')}</span>`}
      <span class="artboard-video-overlay" aria-hidden="true"><span class="artboard-video-play">${icon('play')}</span>${duration ? `<span class="artboard-video-duration">${escapeHtml(duration)}</span>` : ''}</span>
    </span>`;
  }
  function mediaCountText(designs, deleted = false) {
    const videoCount = designs.filter(isVideoDesign).length;
    if (!videoCount) return `${designs.length} 张${deleted ? '已删除页面' : '设计稿'}`;
    if (videoCount === designs.length) return `${designs.length} 个视频`;
    return `${designs.length} 项内容 · ${videoCount} 个视频`;
  }
  function availableDesigns() {
    return data.designs.filter(design => !state.deletedDesigns.has(design.index));
  }
  function designGroups(design) {
    const assignedGroup = state.groupAssignments[design.index];
    return assignedGroup ? [assignedGroup] : design.groups;
  }
  function designsInGroup(group) {
    const designs = availableDesigns();
    if (group === '全部') return designs;
    const groupDesigns = designs.filter(design => designGroups(design).includes(group));
    const savedOrder = state.groupItemOrder[group] || [];
    if (!savedOrder.length) return groupDesigns;
    const designsByIndex = new Map(groupDesigns.map(design => [design.index, design]));
    const ordered = savedOrder.map(index => designsByIndex.get(index)).filter(Boolean);
    const orderedIndexes = new Set(ordered.map(design => design.index));
    return [...ordered, ...groupDesigns.filter(design => !orderedIndexes.has(design.index))];
  }
  function normalizeSearch(value) {
    return value.toLocaleLowerCase('zh-CN').replace(/[\s\-_/·]+/g, '');
  }
  function fuzzyMatch(name, query) {
    const target = normalizeSearch(name);
    const needle = normalizeSearch(query);
    if (!needle || target.includes(needle)) return true;

    let index = 0;
    for (const char of target) {
      if (char === needle[index]) index += 1;
      if (index === needle.length) return true;
    }
    return false;
  }
  function filteredDesigns(group) {
    return designsInGroup(group).filter(design => fuzzyMatch(design.name, state.query));
  }
  function deletedDesignsList() {
    return data.designs
      .filter(design => state.deletedDesigns.has(design.index) && fuzzyMatch(design.name, state.query))
      .sort((a, b) => (state.deletedDesignMeta[b.index]?.deletedAt || 0) - (state.deletedDesignMeta[a.index]?.deletedAt || 0));
  }
  function groupListMarkup() {
    return `
      ${orderedGroups().map(group => {
        const expanded = state.expandedGroups.has(group.name);
        const active = state.group === group.name ? ' active' : '';
        const displayName = escapeHtml(groupDisplayName(group.name));
        const groupCount = designsInGroup(group.name).length;
        return `
          <div class="group-section" data-group="${escapeHtml(group.name)}">
            <div class="group-row-shell${active}" data-group="${escapeHtml(group.name)}">
              <button class="group-row${active}" data-group="${escapeHtml(group.name)}" aria-expanded="${expanded}">
                <span class="group-chevron">${icon(expanded ? 'chevronDown' : 'chevronRight')}</span>
                <span class="group-label">${icon('folder')}<span class="group-label-text">${displayName}</span></span>
                <span class="count">${groupCount}</span>
              </button>
              <button class="group-more" type="button" data-group="${escapeHtml(group.name)}" aria-label="${displayName} 更多操作" aria-haspopup="menu" aria-expanded="false" title="更多操作">${icon('more')}</button>
            </div>
            <div class="group-children${expanded ? ' is-expanded' : ''}" aria-hidden="${!expanded}" ${expanded ? '' : 'inert'}>
              <div class="group-children-inner">
                ${designsInGroup(group.name).map(design => `
                  <button class="group-child${state.focusedDesign === design.index ? ' active' : ''}" draggable="true" data-design-index="${design.index}" data-group="${escapeHtml(group.name)}" title="${escapeHtml(design.name)}">
                    ${icon(isVideoDesign(design) ? 'video' : 'image')}<span>${escapeHtml(design.name)}</span>
                  </button>`).join('')}
              </div>
            </div>
          </div>`;
      }).join('')}`;
  }
  function bindGroupList() {
    const list = document.querySelector('.group-list');
    list.onscroll = closeGroupMenus;
    list.querySelectorAll('.group-more').forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        openGroupMenu(button, button.dataset.group);
      };
    });
    bindGroupReordering(list);
    bindGroupItemDropZones(list);
    list.querySelectorAll('.group-row').forEach(btn => btn.onclick = () => {
      if (performance.now() < suppressGroupClickUntil) return;
      const group = btn.dataset.group;
      const groupChanged = state.group !== group;
      state.group = group;
      state.focusedDesign = null;
      document.querySelector('.show-all').classList.remove('active');
      document.querySelector('.recycle-button')?.classList.remove('active');
      list.querySelectorAll('.group-row').forEach(row => row.classList.toggle('active', row === btn));
      list.querySelectorAll('.group-child').forEach(child => child.classList.remove('active'));

      if (group !== '全部') {
        const expanded = !state.expandedGroups.has(group);
        if (expanded) state.expandedGroups.add(group); else state.expandedGroups.delete(group);
        btn.setAttribute('aria-expanded', String(expanded));
        btn.querySelector('.group-chevron').innerHTML = icon(expanded ? 'chevronDown' : 'chevronRight');
        const children = btn.closest('.group-section').querySelector('.group-children');
        children.classList.toggle('is-expanded', expanded);
        children.setAttribute('aria-hidden', String(!expanded));
        children.inert = !expanded;
      }

      if (groupChanged) renderStage();
    });
    list.querySelectorAll('.group-row-shell').forEach(row => {
      row.ondragenter = event => {
        if (!draggedDesign || draggedDesign.sourceGroup === row.dataset.group) return;
        event.preventDefault();
        clearGroupDropTargets();
        row.classList.add('is-drop-target');
      };
      row.ondragover = event => {
        if (!draggedDesign || draggedDesign.sourceGroup === row.dataset.group) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        row.classList.add('is-drop-target');
      };
      row.ondragleave = event => {
        if (!row.contains(event.relatedTarget)) row.classList.remove('is-drop-target');
      };
      row.ondrop = event => {
        if (!draggedDesign || draggedDesign.sourceGroup === row.dataset.group) return;
        event.preventDefault();
        event.stopPropagation();
        moveDesignToGroup(draggedDesign.index, draggedDesign.sourceGroup, row.dataset.group);
      };
    });
    list.querySelectorAll('.group-child').forEach(btn => {
      btn.onclick = () => {
        const index = Number(btn.dataset.designIndex);
        if (draggedDesign?.index === index) return;
        focusDesign(index, btn.dataset.group);
      };
      btn.ondragstart = event => {
        draggedDesign = { index: Number(btn.dataset.designIndex), sourceGroup: btn.dataset.group };
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(draggedDesign.index));
        btn.classList.add('is-dragging');
        list.classList.add('is-dragging-page');
        closeGroupMenus();
      };
      btn.ondragend = () => {
        btn.classList.remove('is-dragging');
        finishDesignDragging();
      };
    });
  }
  function bindRecycleBin() {
    const button = document.querySelector('.recycle-button');
    if (!button) return;
    button.onclick = () => {
      const groupChanged = state.group !== '回收站';
      state.group = '回收站';
      state.focusedDesign = null;
      document.querySelector('.show-all')?.classList.remove('active');
      document.querySelectorAll('.group-row, .group-child').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      if (groupChanged) renderStage();
    };
  }
  function bindGroupReordering(list) {
    list.querySelectorAll('.group-section').forEach(section => {
      const row = section.querySelector('.group-row');
      row.onpointerdown = event => {
        if (event.button !== 0 || event.target.closest('.group-more')) return;
        cancelGroupLongPress();
        const startX = event.clientX;
        const startY = event.clientY;
        const controller = new AbortController();
        groupLongPressController = controller;
        groupLongPressTimer = setTimeout(() => {
          armedGroupSection = section;
          section.draggable = true;
          section.classList.add('is-drag-armed');
          list.classList.add('is-group-drag-armed');
        }, 320);

        addEventListener('pointermove', moveEvent => {
          if (armedGroupSection === section) return;
          if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 6) cancelGroupLongPress();
        }, { signal: controller.signal });
        addEventListener('pointerup', () => {
          const wasArmed = armedGroupSection === section;
          cancelGroupLongPress();
          if (wasArmed) suppressGroupClickUntil = performance.now() + 350;
        }, { once: true, signal: controller.signal });
        addEventListener('pointercancel', cancelGroupLongPress, { once: true, signal: controller.signal });
      };
      section.ondragstart = event => {
        if (event.target !== section || armedGroupSection !== section) return;
        clearTimeout(groupLongPressTimer);
        groupLongPressController?.abort();
        groupLongPressController = null;
        armedGroupSection = null;
        draggedGroup = section.dataset.group;
        suppressGroupClickUntil = performance.now() + 1000;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', `group:${draggedGroup}`);
        event.dataTransfer.setDragImage(row, 24, row.offsetHeight / 2);
        section.classList.remove('is-drag-armed');
        section.classList.add('is-group-dragging');
        list.classList.remove('is-group-drag-armed');
        list.classList.add('is-reordering-groups');
        closeGroupMenus();
      };
      section.ondragover = event => {
        if (!draggedGroup || draggedGroup === section.dataset.group) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        clearGroupOrderTargets();
        const rowRect = row.getBoundingClientRect();
        section.classList.add(event.clientY < rowRect.top + rowRect.height / 2 ? 'group-drop-before' : 'group-drop-after');
      };
      section.ondragleave = event => {
        if (!section.contains(event.relatedTarget)) section.classList.remove('group-drop-before', 'group-drop-after');
      };
      section.ondrop = event => {
        if (!draggedGroup || draggedGroup === section.dataset.group) return;
        event.preventDefault();
        event.stopPropagation();
        const position = section.classList.contains('group-drop-before') ? 'before' : 'after';
        reorderGroup(draggedGroup, section.dataset.group, position);
      };
      section.ondragend = () => finishGroupReordering();
    });
  }
  function cancelGroupLongPress() {
    clearTimeout(groupLongPressTimer);
    groupLongPressTimer = null;
    groupLongPressController?.abort();
    groupLongPressController = null;
    if (armedGroupSection) {
      armedGroupSection.draggable = false;
      armedGroupSection.classList.remove('is-drag-armed');
      armedGroupSection = null;
    }
    document.querySelector('.group-list')?.classList.remove('is-group-drag-armed');
  }
  function clearGroupOrderTargets() {
    document.querySelectorAll('.group-section.group-drop-before, .group-section.group-drop-after').forEach(section => {
      section.classList.remove('group-drop-before', 'group-drop-after');
    });
  }
  function finishGroupReordering() {
    cancelGroupLongPress();
    clearGroupOrderTargets();
    document.querySelectorAll('.group-section[draggable="true"]').forEach(section => { section.draggable = false; });
    document.querySelectorAll('.group-section.is-group-dragging').forEach(section => section.classList.remove('is-group-dragging'));
    document.querySelector('.group-list')?.classList.remove('is-reordering-groups');
    setTimeout(() => { draggedGroup = null; }, 0);
  }
  function reorderGroup(sourceGroup, targetGroup, position) {
    const nextOrder = state.groupOrder.filter(group => group !== sourceGroup);
    const targetIndex = nextOrder.indexOf(targetGroup);
    nextOrder.splice(targetIndex + (position === 'after' ? 1 : 0), 0, sourceGroup);
    state.groupOrder = nextOrder;
    saveGroupOrder();
    finishGroupReordering();
    refreshGroupNavigation();
    toast(`已调整“${groupDisplayName(sourceGroup)}”的顺序`);
  }
  function clearGroupDropTargets() {
    document.querySelectorAll('.group-row-shell.is-drop-target').forEach(row => row.classList.remove('is-drop-target'));
  }
  function clearGroupItemDropTargets() {
    document.querySelectorAll('.group-child.design-drop-before, .group-child.design-drop-after').forEach(child => {
      child.classList.remove('design-drop-before', 'design-drop-after');
    });
    document.querySelectorAll('.group-children-inner.is-page-drop-target').forEach(container => {
      container.classList.remove('is-page-drop-target');
    });
  }
  function bindGroupItemDropZones(list) {
    list.querySelectorAll('.group-children-inner').forEach(container => {
      const group = container.closest('.group-section').dataset.group;
      container.ondragover = event => {
        if (!draggedDesign || event.target.closest('.group-child')) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        clearGroupDropTargets();
        clearGroupItemDropTargets();
        container.classList.add('is-page-drop-target');
      };
      container.ondrop = event => {
        if (!draggedDesign || event.target.closest('.group-child')) return;
        event.preventDefault();
        event.stopPropagation();
        moveDesignToGroup(draggedDesign.index, draggedDesign.sourceGroup, group, designsInGroup(group).length);
      };
    });
    list.querySelectorAll('.group-child').forEach(child => {
      child.ondragenter = event => {
        if (!draggedDesign) return;
        event.preventDefault();
        event.stopPropagation();
        updateGroupItemDropTarget(child, event.clientY);
      };
      child.ondragover = event => {
        if (!draggedDesign) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        updateGroupItemDropTarget(child, event.clientY);
      };
      child.ondragleave = event => {
        if (!child.contains(event.relatedTarget)) child.classList.remove('design-drop-before', 'design-drop-after');
      };
      child.ondrop = event => {
        if (!draggedDesign) return;
        event.preventDefault();
        event.stopPropagation();
        const children = [...child.parentElement.querySelectorAll('.group-child')];
        const position = children.indexOf(child) + (child.classList.contains('design-drop-after') ? 1 : 0);
        moveDesignToGroup(draggedDesign.index, draggedDesign.sourceGroup, child.dataset.group, position);
      };
    });
  }
  function updateGroupItemDropTarget(child, clientY) {
    clearGroupDropTargets();
    clearGroupItemDropTargets();
    const rect = child.getBoundingClientRect();
    child.classList.add(clientY < rect.top + rect.height / 2 ? 'design-drop-before' : 'design-drop-after');
    child.closest('.group-children-inner').classList.add('is-page-drop-target');
  }
  function finishDesignDragging() {
    cancelDesignLongPress();
    clearGroupDropTargets();
    clearGroupItemDropTargets();
    document.querySelector('.group-list')?.classList.remove('is-dragging-page');
    document.querySelector('.stage')?.classList.remove('is-dragging-design');
    document.querySelectorAll('.artboard-shell.is-design-dragging').forEach(card => card.classList.remove('is-design-dragging'));
    setTimeout(() => { draggedDesign = null; }, 0);
  }
  function moveDesignToGroup(index, sourceGroup, targetGroup, targetPosition) {
    const design = availableDesigns().find(item => item.index === index);
    if (!design) return;
    const sourceOrder = designsInGroup(sourceGroup).map(item => item.index);
    const targetOrder = sourceGroup === targetGroup
      ? sourceOrder.slice()
      : designsInGroup(targetGroup).map(item => item.index);
    const previousTargetIndex = targetOrder.indexOf(index);
    let insertionIndex = targetPosition == null ? targetOrder.length : targetPosition;
    if (previousTargetIndex >= 0) {
      targetOrder.splice(previousTargetIndex, 1);
      if (previousTargetIndex < insertionIndex) insertionIndex -= 1;
    }
    insertionIndex = Math.max(0, Math.min(insertionIndex, targetOrder.length));
    targetOrder.splice(insertionIndex, 0, index);

    if (sourceGroup === targetGroup) {
      if (sourceOrder.every((item, order) => item === targetOrder[order])) {
        finishDesignDragging();
        return;
      }
      state.groupItemOrder[targetGroup] = targetOrder;
    } else {
      state.groupItemOrder[sourceGroup] = sourceOrder.filter(item => item !== index);
      state.groupItemOrder[targetGroup] = targetOrder;
      state.groupAssignments[index] = targetGroup;
    }
    state.expandedGroups.add(targetGroup);
    state.focusedDesign = null;
    saveGroupAssignments();
    saveGroupItemOrder();
    finishDesignDragging();
    refreshGroupNavigation();
    toast(sourceGroup === targetGroup
      ? `已调整“${design.name}”的顺序`
      : `已将“${design.name}”移动到“${groupDisplayName(targetGroup)}”`);
  }
  function closeGroupMenus() {
    document.querySelector('.group-context-menu')?.remove();
    document.querySelectorAll('.group-row-shell.has-open-menu').forEach(row => row.classList.remove('has-open-menu'));
    document.querySelectorAll('.group-more[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  }
  function openGroupMenu(button, groupName) {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    closeGroupMenus();
    if (wasOpen) return;

    const groupCount = designsInGroup(groupName).length;
    const menu = document.createElement('div');
    menu.className = 'group-context-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `
      <button class="group-menu-item group-menu-rename" type="button" role="menuitem">${icon('pencil')}<span>重命名</span></button>
      <button class="group-menu-item group-menu-delete" type="button" role="menuitem" ${groupCount ? '' : 'disabled'}>${icon('trash')}<span>删除本组页面</span></button>`;
    document.body.appendChild(menu);

    const buttonRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const preferredLeft = buttonRect.right + 8;
    const left = preferredLeft + menuRect.width <= innerWidth - 12
      ? preferredLeft
      : Math.max(12, buttonRect.left - menuRect.width - 8);
    const top = Math.min(innerHeight - menuRect.height - 12, Math.max(12, buttonRect.top - 6));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    button.setAttribute('aria-expanded', 'true');
    button.closest('.group-row-shell').classList.add('has-open-menu');

    menu.querySelector('.group-menu-rename').onclick = () => {
      closeGroupMenus();
      openRenameGroupDialog(groupName);
    };
    menu.querySelector('.group-menu-delete').onclick = () => {
      closeGroupMenus();
      openDeleteGroupDialog(groupName);
    };
  }
  function openRenameGroupDialog(groupName) {
    const dialog = document.createElement('div');
    dialog.className = 'group-dialog-backdrop';
    dialog.innerHTML = `
      <form class="group-dialog" role="dialog" aria-modal="true" aria-labelledby="rename-group-title">
        <div class="group-dialog-icon">${icon('pencil')}</div>
        <h3 id="rename-group-title">重命名分组</h3>
        <label class="group-dialog-field"><span>分组名称</span><input maxlength="30" autocomplete="off" value="${escapeHtml(groupDisplayName(groupName))}"></label>
        <p class="group-dialog-error" aria-live="polite"></p>
        <div class="group-dialog-actions"><button class="dialog-cancel" type="button">取消</button><button class="dialog-primary" type="submit">保存</button></div>
      </form>`;
    document.body.appendChild(dialog);
    const input = dialog.querySelector('input');
    const error = dialog.querySelector('.group-dialog-error');
    const close = () => dialog.remove();
    dialog.querySelector('.dialog-cancel').onclick = close;
    dialog.onclick = event => { if (event.target === dialog) close(); };
    dialog.querySelector('form').onsubmit = event => {
      event.preventDefault();
      const nextName = input.value.trim();
      const duplicate = orderedGroups().some(group => group.name !== groupName && groupDisplayName(group.name) === nextName);
      if (!nextName) {
        error.textContent = '请输入分组名称';
        input.focus();
        return;
      }
      if (duplicate) {
        error.textContent = '该分组名称已存在';
        input.focus();
        return;
      }
      state.groupRenames[groupName] = nextName;
      saveGroupRenames();
      close();
      refreshGroupNavigation();
      toast(`已重命名为“${nextName}”`);
    };
    dialog.onkeydown = event => { if (event.key === 'Escape') close(); };
    requestAnimationFrame(() => { input.focus(); input.select(); });
  }
  function openDeleteGroupDialog(groupName) {
    const groupCount = designsInGroup(groupName).length;
    if (!groupCount) return;
    const displayName = groupDisplayName(groupName);
    const dialog = document.createElement('div');
    dialog.className = 'group-dialog-backdrop';
    dialog.innerHTML = `
      <div class="group-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-group-title">
        <div class="group-dialog-icon danger">${icon('trash')}</div>
        <h3 id="delete-group-title">删除本组页面</h3>
        <p class="group-dialog-copy">确定删除“${escapeHtml(displayName)}”中的 ${groupCount} 项内容吗？</p>
        <div class="group-dialog-actions"><button class="dialog-cancel" type="button">取消</button><button class="dialog-primary danger" type="button">确认删除</button></div>
      </div>`;
    document.body.appendChild(dialog);
    const close = () => dialog.remove();
    dialog.querySelector('.dialog-cancel').onclick = close;
    dialog.querySelector('.dialog-primary').onclick = () => {
      const groupDesigns = designsInGroup(groupName);
      groupDesigns.forEach(design => {
        rememberDeletedDesign(design, groupName);
        state.deletedDesigns.add(design.index);
      });
      state.focusedDesign = null;
      saveDeletedDesigns();
      saveDeletedDesignMeta();
      close();
      refreshGroupNavigation();
      toast(`已删除“${displayName}”中的 ${groupDesigns.length} 项内容`);
    };
    dialog.onclick = event => { if (event.target === dialog) close(); };
    dialog.onkeydown = event => { if (event.key === 'Escape') close(); };
    requestAnimationFrame(() => dialog.querySelector('.dialog-cancel').focus());
  }
  function refreshGroupNavigation() {
    const groupList = document.querySelector('.group-list');
    if (groupList) {
      groupList.innerHTML = groupListMarkup();
      bindGroupList();
    }
    const total = document.querySelector('.show-all .count');
    if (total) total.textContent = availableDesigns().length;
    const recycleCount = document.querySelector('.recycle-button .count');
    if (recycleCount) recycleCount.textContent = state.deletedDesigns.size;
    renderStage();
  }
  function focusDesign(index, groupName) {
    const design = data.designs.find(item => item.index === index);
    if (!design) return;

    const groupChanged = state.group !== groupName;
    const queryCleared = Boolean(state.query) && !fuzzyMatch(design.name, state.query);
    state.group = groupName;
    state.focusedDesign = index;
    document.querySelector('.show-all').classList.remove('active');
    document.querySelector('.recycle-button')?.classList.remove('active');
    document.querySelectorAll('.group-row').forEach(row => row.classList.toggle('active', row.dataset.group === groupName));
    document.querySelectorAll('.group-child').forEach(child => {
      child.classList.toggle('active', Number(child.dataset.designIndex) === index);
    });

    if (queryCleared) {
      state.query = '';
      const searchInput = document.getElementById('design-search');
      searchInput.value = '';
      document.querySelector('.search-clear').hidden = true;
    }
    const targetPosition = filteredDesigns(groupName).findIndex(item => item.index === index);
    if (targetPosition >= 0) {
      state.galleryKey = `${groupName}\n${state.query}`;
      state.galleryLimit = Math.max(state.galleryLimit, targetPosition + 1);
    }
    if (groupChanged || queryCleared) renderStage();

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const card = document.querySelector(`.artboard-shell[data-index="${index}"]`);
      if (!card) return;
      card.classList.add('is-visible');
      card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      card.classList.remove('is-focused');
      void card.offsetWidth;
      card.classList.add('is-focused');
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => card.classList.remove('is-focused'), 2400);
    }));
  }
  function revealCards(cards) {
    cardObserver?.disconnect();
    if (!cards.length) return;

    cards.forEach(card => {
      const image = card.querySelector('.artboard-media img');
      const completeReveal = event => {
        if (event.animationName !== 'artboard-reveal' && event.animationName !== 'immersive-media-settle') return;
        card.removeEventListener('animationend', completeReveal);
        card.classList.remove('reveal-pending', 'is-visible', 'is-image-ready');
        card.style.removeProperty('--reveal-delay');
      };
      card.addEventListener('animationend', completeReveal);
      if (!image) {
        card.classList.add('is-image-ready');
        return;
      }
      const markImageReady = () => {
        if (card.classList.contains('reveal-pending')) card.classList.add('is-image-ready');
      };
      if (image.complete && image.naturalWidth) markImageReady();
      else {
        image.addEventListener('load', markImageReady, { once: true });
        image.addEventListener('error', markImageReady, { once: true });
      }
    });

    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach(card => card.classList.remove('reveal-pending', 'is-visible', 'is-image-ready'));
      return;
    }

    const viewport = document.getElementById('viewport');
    const immersive = cards.some(card => card.classList.contains('immersive-artboard'));
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
      visible.forEach((entry, order) => {
        const column = Number(entry.target.style.getPropertyValue('--masonry-column')) || 0;
        const stagger = immersive
          ? Math.min(order, 7) * 38 + (column % 2) * 12
          : Math.min(order, 8) * 45;
        entry.target.style.setProperty('--reveal-delay', `${stagger}ms`);
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      root: viewport,
      rootMargin: immersive ? '0px 0px -5% 0px' : '0px 0px 72px 0px',
      threshold: immersive ? .012 : .08
    });

    cardObserver = observer;
    cards.forEach(card => observer.observe(card));
  }
  function observeGalleryAutoLoad(container, loadMore) {
    galleryLoadObserver?.disconnect();
    galleryLoadObserver = null;
    const sentinel = container?.querySelector('.gallery-load-sentinel');
    if (!sentinel) return;

    let triggered = false;
    const triggerLoad = () => {
      if (triggered || !sentinel.isConnected) return;
      triggered = true;
      sentinel.classList.add('is-loading');
      galleryLoadObserver?.disconnect();
      requestAnimationFrame(loadMore);
    };

    if (!('IntersectionObserver' in window)) {
      triggerLoad();
      return;
    }

    const scrollRoot = sentinel.closest('.immersive-view, .stage-viewport');
    galleryLoadObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) triggerLoad();
    }, {
      root: scrollRoot,
      rootMargin: '0px 0px 480px 0px',
      threshold: .01
    });
    galleryLoadObserver.observe(sentinel);
  }
  function layoutMasonryGrid(grid) {
    if (!grid?.isConnected) return;
    const cards = [...grid.querySelectorAll(':scope > .artboard-shell')];
    const availableWidth = grid.clientWidth;
    if (!cards.length || availableWidth <= 0) {
      grid.style.height = '0px';
      return;
    }

    const columnGap = 16;
    const rowGap = 18;
    const isSparseGrid = cards.length <= 4;
    const minimumColumnWidth = isSparseGrid ? 220 : 260;
    const maximumDenseColumnWidth = 520;
    const maximumSparseColumnWidth = 260;
    const maximumColumnCount = Math.max(1, Math.floor((availableWidth + columnGap) / (minimumColumnWidth + columnGap)));
    const targetColumnWidth = isSparseGrid ? maximumSparseColumnWidth : maximumDenseColumnWidth;
    const preferredColumnCount = Math.max(1, Math.ceil((availableWidth + columnGap) / (targetColumnWidth + columnGap)));
    const contentColumnCount = Math.min(cards.length, maximumColumnCount);
    const columnCount = Math.min(maximumColumnCount, Math.max(
      contentColumnCount,
      preferredColumnCount
    ));
    const columnWidth = (availableWidth - columnGap * (columnCount - 1)) / columnCount;
    const columnHeights = Array(columnCount).fill(0);

    cards.forEach((card, index) => {
      const column = index < columnCount
        ? index
        : columnHeights.indexOf(Math.min(...columnHeights));
      card.style.width = `${columnWidth}px`;
      card.style.left = `${column * (columnWidth + columnGap)}px`;
      card.style.top = `${columnHeights[column]}px`;
      card.style.setProperty('--masonry-column', column);
      card.style.setProperty('--magnet-x', `${column % 2 ? 13 : -13}px`);
      card.style.setProperty('--magnet-x-near', `${column % 2 ? 2 : -2}px`);
      card.style.setProperty('--magnet-y', `${78 + (column % 3) * 14}px`);
      card.style.setProperty('--magnet-rotate', `${column % 2 ? 0.7 : -0.7}deg`);
      card.style.setProperty('--magnet-rotate-near', `${column % 2 ? 0.11 : -0.11}deg`);
      columnHeights[column] += card.offsetHeight + rowGap;
    });

    grid.style.height = `${Math.max(...columnHeights) - rowGap}px`;
    grid.style.setProperty('--masonry-columns', columnCount);
    const usedColumnCount = Math.min(cards.length, columnCount);
    const contentWidth = columnWidth * usedColumnCount + columnGap * Math.max(0, usedColumnCount - 1);
    const immersiveHeading = grid.previousElementSibling;
    if (immersiveHeading?.classList.contains('immersive-gallery-heading')) {
      immersiveHeading.style.width = `${contentWidth}px`;
    }
  }
  function observeMasonryGrid(grid) {
    masonryObserver?.disconnect();
    cancelAnimationFrame(masonryLayoutFrame);
    if (!grid) return;

    const scheduleLayout = () => {
      cancelAnimationFrame(masonryLayoutFrame);
      masonryLayoutFrame = requestAnimationFrame(() => layoutMasonryGrid(grid));
    };
    layoutMasonryGrid(grid);
    if ('ResizeObserver' in window) {
      masonryObserver = new ResizeObserver(scheduleLayout);
      masonryObserver.observe(grid);
    } else {
      addEventListener('resize', scheduleLayout, { once: true });
    }
  }
  function renderStage() {
    cancelDesignLongPress();
    masonryObserver?.disconnect();
    cancelAnimationFrame(masonryLayoutFrame);
    const stage = document.getElementById('stage'); if (!stage) return;
    if (state.group === '回收站') {
      renderRecycleBin(stage);
      return;
    }
    const list = filteredDesigns(state.group);
    const galleryKey = `${state.group}\n${state.query}`;
    if (state.galleryKey !== galleryKey) {
      state.galleryKey = galleryKey;
      state.galleryLimit = GALLERY_BATCH_SIZE;
    }
    const visibleList = list.slice(0, state.galleryLimit);
    const remainingCount = list.length - visibleList.length;
    stage.innerHTML = `
      <section class="gallery-section">
        <div class="gallery-heading"><h2>${escapeHtml(groupDisplayName(state.group))}</h2><span>${mediaCountText(list)}</span></div>
        ${list.length ? `<div class="masonry-grid">
          ${visibleList.map(d=>`
            <div class="artboard-shell reveal-pending" data-index="${d.index}">
              <button class="artboard-open" type="button" aria-label="预览 ${escapeHtml(d.name)}">
                ${designMediaMarkup(d)}
                <span class="artboard-meta"><span class="project-symbol"></span><span class="artboard-name">${escapeHtml(d.name)}</span></span>
              </button>
              <span class="artboard-actions">
                <button class="artboard-more" type="button" aria-label="${escapeHtml(d.name)} 更多操作" aria-haspopup="menu" aria-expanded="false" title="更多操作">${icon('more')}</button>
                <span class="artboard-menu" role="menu" hidden>
                  <button class="artboard-delete" type="button" role="menuitem">${icon('trash')}<span>删除本页</span></button>
                </span>
              </span>
            </div>`).join('')}
        </div>${remainingCount > 0 ? '<div class="gallery-load-sentinel" role="status" aria-label="正在加载更多内容"><span aria-hidden="true"></span></div>' : ''}` : '<div class="search-empty">没有找到匹配的内容</div>'}
      </section>`;
    const cards = [...stage.querySelectorAll('.artboard-shell')];
    observeMasonryGrid(stage.querySelector('.masonry-grid'));
    cards.forEach(card => {
      const design = list.find(item => item.index === Number(card.dataset.index));
      const openButton = card.querySelector('.artboard-open');
      openButton.onclick = () => {
        const index = Number(card.dataset.index);
        if (performance.now() < suppressDesignOpenUntil && suppressedDesignIndex === index) return;
        openLightbox(index);
      };
      bindDesignCardDragging(card, openButton, design);
      card.querySelector('.artboard-more').onclick = event => {
        event.stopPropagation();
        const willOpen = !card.classList.contains('has-open-menu');
        closeArtboardMenus();
        card.classList.toggle('has-open-menu', willOpen);
        card.querySelector('.artboard-more').setAttribute('aria-expanded', String(willOpen));
        card.querySelector('.artboard-menu').hidden = !willOpen;
      };
      card.querySelector('.artboard-delete').onclick = event => {
        event.stopPropagation();
        deleteDesign(Number(card.dataset.index));
      };
    });
    observeGalleryAutoLoad(stage, () => {
      state.galleryLimit += GALLERY_BATCH_SIZE;
      renderStage();
    });
    revealCards(cards);
  }
  function bindDesignCardDragging(card, openButton, design) {
    if (!design) return;
    openButton.onpointerdown = event => {
      if (event.button !== 0) return;
      cancelDesignLongPress();
      const startX = event.clientX;
      const startY = event.clientY;
      const controller = new AbortController();
      designLongPressController = controller;
      designLongPressTimer = setTimeout(() => {
        armedDesignCard = card;
        openButton.draggable = true;
        card.classList.add('is-drag-armed');
      }, 320);

      addEventListener('pointermove', moveEvent => {
        if (armedDesignCard === card) return;
        if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 6) cancelDesignLongPress();
      }, { signal: controller.signal });
      addEventListener('pointerup', () => {
        const wasArmed = armedDesignCard === card;
        cancelDesignLongPress();
        if (wasArmed) {
          suppressedDesignIndex = design.index;
          suppressDesignOpenUntil = performance.now() + 350;
        }
      }, { once: true, signal: controller.signal });
      addEventListener('pointercancel', cancelDesignLongPress, { once: true, signal: controller.signal });
    };
    openButton.ondragstart = event => {
      if (armedDesignCard !== card) {
        event.preventDefault();
        return;
      }
      clearTimeout(designLongPressTimer);
      designLongPressTimer = null;
      designLongPressController?.abort();
      designLongPressController = null;
      armedDesignCard = null;
      const visibleGroups = designGroups(design);
      const sourceGroup = state.group !== '全部' && visibleGroups.includes(state.group)
        ? state.group
        : visibleGroups[0];
      draggedDesign = { index: design.index, sourceGroup };
      suppressedDesignIndex = design.index;
      suppressDesignOpenUntil = performance.now() + 1000;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(design.index));
      event.dataTransfer.setDragImage(card, Math.min(36, card.offsetWidth / 2), Math.min(36, card.offsetHeight / 2));
      card.classList.remove('is-drag-armed');
      card.classList.add('is-design-dragging');
      document.querySelector('.stage')?.classList.add('is-dragging-design');
      document.querySelector('.group-list')?.classList.add('is-dragging-page');
      closeArtboardMenus();
      closeGroupMenus();
    };
    openButton.ondragend = () => {
      openButton.draggable = false;
      finishDesignDragging();
    };
  }
  function cancelDesignLongPress() {
    clearTimeout(designLongPressTimer);
    designLongPressTimer = null;
    designLongPressController?.abort();
    designLongPressController = null;
    if (armedDesignCard) {
      const openButton = armedDesignCard.querySelector('.artboard-open');
      if (openButton) openButton.draggable = false;
      armedDesignCard.classList.remove('is-drag-armed');
      armedDesignCard = null;
    }
  }
  function renderRecycleBin(stage) {
    const list = deletedDesignsList();
    stage.innerHTML = `
      <section class="gallery-section recycle-gallery">
        <div class="gallery-heading"><h2>回收站</h2><span>${mediaCountText(list, true)}</span></div>
        ${list.length ? `<div class="masonry-grid">
          ${list.map(design => `
            <div class="artboard-shell recycle-card reveal-pending" data-index="${design.index}">
              ${designMediaMarkup(design)}
              <span class="recycle-card-meta">
                <span class="recycle-card-copy"><span class="project-symbol"></span><span class="artboard-name">${escapeHtml(design.name)}</span></span>
                <button class="restore-design" type="button" aria-label="找回 ${escapeHtml(design.name)}">${icon('rotateCcw')}<span>找回</span></button>
              </span>
            </div>`).join('')}
        </div>` : `<div class="search-empty">${state.query ? '没有找到匹配的已删除页面' : '回收站为空'}</div>`}
      </section>`;
    const cards = [...stage.querySelectorAll('.recycle-card')];
    observeMasonryGrid(stage.querySelector('.masonry-grid'));
    cards.forEach(card => {
      card.querySelector('.restore-design').onclick = () => restoreDesign(Number(card.dataset.index));
    });
    revealCards(cards);
  }
  function closeArtboardMenus() {
    document.querySelectorAll('.artboard-shell.has-open-menu').forEach(card => {
      card.classList.remove('has-open-menu');
      card.querySelector('.artboard-more')?.setAttribute('aria-expanded', 'false');
      const menu = card.querySelector('.artboard-menu');
      if (menu) menu.hidden = true;
    });
  }
  function deleteDesign(index) {
    const design = availableDesigns().find(item => item.index === index);
    if (!design) return;
    rememberDeletedDesign(design, designGroups(design)[0]);
    state.deletedDesigns.add(index);
    if (state.focusedDesign === index) state.focusedDesign = null;
    saveDeletedDesigns();
    saveDeletedDesignMeta();

    refreshGroupNavigation();
    toast(`已删除“${design.name}”`);
  }
  function rememberDeletedDesign(design, groupName) {
    state.deletedDesignMeta[design.index] = {
      group: groupName || designGroups(design)[0] || null,
      deletedAt: Date.now()
    };
  }
  function ensureDefaultGroup() {
    const existingDefaultGroup = orderedGroups().find(group => groupDisplayName(group.name) === '默认分组');
    if (existingDefaultGroup) return existingDefaultGroup.name;
    if (!state.groupOrder.includes(DEFAULT_GROUP_ID)) {
      state.groupOrder.push(DEFAULT_GROUP_ID);
      saveGroupOrder();
    }
    return DEFAULT_GROUP_ID;
  }
  function restoreDesign(index) {
    const design = data.designs.find(item => item.index === index);
    if (!design || !state.deletedDesigns.has(index)) return;

    const meta = state.deletedDesignMeta[index] || {};
    let targetGroup = meta.group || state.groupAssignments[index] || design.groups[0];
    const groupStillExists = orderedGroups().some(group => group.name === targetGroup);
    if (!groupStillExists) targetGroup = ensureDefaultGroup();

    state.groupAssignments[index] = targetGroup;
    state.deletedDesigns.delete(index);
    delete state.deletedDesignMeta[index];
    saveGroupAssignments();
    saveDeletedDesigns();
    saveDeletedDesignMeta();
    refreshGroupNavigation();
    toast(`已将“${design.name}”恢复到“${groupDisplayName(targetGroup)}”`);
  }
  function openLightbox(index) {
    const d = availableDesigns().find(x=>x.index===index); if(!d)return;
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <div class="lightbox-top">
        <strong>${escapeHtml(d.name)}</strong><span class="spacer"></span><span class="lightbox-group">${escapeHtml(designGroups(d).map(groupDisplayName).join(' · '))}</span>
        <button class="lightbox-close" aria-label="关闭预览"></button>
      </div>
      <div class="lightbox-body">
        <img class="lightbox-image" alt="" draggable="false" hidden>
        <video class="lightbox-video" playsinline preload="metadata" hidden></video>
        <div class="lightbox-video-controls" hidden>
          <button class="lightbox-video-play" type="button" aria-label="暂停">${icon('pause')}</button>
          <span class="lightbox-video-time lightbox-video-current">0:00</span>
          <input class="lightbox-video-progress" type="range" min="0" max="100" step="0.1" value="0" aria-label="播放进度">
          <span class="lightbox-video-time lightbox-video-duration">0:00</span>
          <button class="lightbox-video-mute" type="button" aria-label="静音">${icon('volume')}</button>
          <input class="lightbox-video-volume" type="range" min="0" max="1" step="0.05" value="1" aria-label="音量">
          <button class="lightbox-video-fullscreen" type="button" aria-label="全屏播放">${icon('maximize')}</button>
        </div>
        <div class="lightbox-media-error" role="status" hidden>该视频暂时无法播放，请检查文件格式或地址。</div>
      </div>
      <button class="lightbox-nav lightbox-prev" aria-label="上一张">${icon('chevronLeft')}</button>
      <button class="lightbox-nav lightbox-next" aria-label="下一张">${icon('chevronRight')}</button>`;

    const body = box.querySelector('.lightbox-body');
    const image = box.querySelector('.lightbox-image');
    const video = box.querySelector('.lightbox-video');
    const videoControls = box.querySelector('.lightbox-video-controls');
    const videoPlayButton = box.querySelector('.lightbox-video-play');
    const videoProgress = box.querySelector('.lightbox-video-progress');
    const videoCurrentTime = box.querySelector('.lightbox-video-current');
    const videoDuration = box.querySelector('.lightbox-video-duration');
    const videoMuteButton = box.querySelector('.lightbox-video-mute');
    const videoVolume = box.querySelector('.lightbox-video-volume');
    const videoFullscreenButton = box.querySelector('.lightbox-video-fullscreen');
    const mediaError = box.querySelector('.lightbox-media-error');
    const title = box.querySelector('.lightbox-top strong');
    const group = box.querySelector('.lightbox-group');
    const previousButton = box.querySelector('.lightbox-prev');
    const nextButton = box.querySelector('.lightbox-next');
    const controller = new AbortController();
    const view = { scale: 1, fitScale: 1, x: 0, y: 0, dragging: false, pointerStartedOnImage: false, startX: 0, startY: 0, originX: 0, originY: 0 };
    const visibleDesigns = filteredDesigns(state.group);
    const navigationList = visibleDesigns.some(design => design.index === index) ? visibleDesigns : availableDesigns();
    let currentPosition = navigationList.findIndex(design => design.index === index);
    let currentDesign = d;
    let mediaLoadToken = 0;
    let isClosing = false;

    function formatVideoTime(value) {
      if (!Number.isFinite(value) || value < 0) return '0:00';
      const minutes = Math.floor(value / 60);
      const seconds = Math.floor(value % 60);
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    function updateVideoControls() {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      videoProgress.value = duration ? String((video.currentTime / duration) * 100) : '0';
      videoCurrentTime.textContent = formatVideoTime(video.currentTime);
      videoDuration.textContent = formatVideoTime(duration);
      videoPlayButton.innerHTML = video.paused ? icon('play') : icon('pause');
      videoPlayButton.setAttribute('aria-label', video.paused ? '播放' : '暂停');
      const silent = video.muted || video.volume === 0;
      videoMuteButton.innerHTML = icon(silent ? 'volumeOff' : 'volume');
      videoMuteButton.setAttribute('aria-label', silent ? '取消静音' : '静音');
      videoVolume.value = String(silent ? 0 : video.volume);
    }

    function toggleVideoPlayback() {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    }

    function requestVideoFullscreen() {
      const target = box;
      if (target.requestFullscreen) target.requestFullscreen().catch(() => {});
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    }

    function clampPosition() {
      const inset = 24;
      const width = image.naturalWidth * view.scale;
      const height = image.naturalHeight * view.scale;
      view.x = width + inset * 2 <= body.clientWidth
        ? (body.clientWidth - width) / 2
        : Math.min(inset, Math.max(body.clientWidth - width - inset, view.x));
      view.y = height + inset * 2 <= body.clientHeight
        ? (body.clientHeight - height) / 2
        : Math.min(inset, Math.max(body.clientHeight - height - inset, view.y));
    }

    function applyView() {
      clampPosition();
      image.style.transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`;
      body.classList.toggle('is-zoomed', view.scale > view.fitScale * 1.001);
    }

    function fitImage() {
      if (!image.naturalWidth || !image.naturalHeight) return;
      const availableWidth = Math.max(1, body.clientWidth - 48);
      const availableHeight = Math.max(1, body.clientHeight - 48);
      view.fitScale = Math.min(availableWidth / image.naturalWidth, availableHeight / image.naturalHeight, 1);
      view.scale = view.fitScale;
      view.x = (body.clientWidth - image.naturalWidth * view.scale) / 2;
      view.y = (body.clientHeight - image.naturalHeight * view.scale) / 2;
      applyView();
    }

    function resetMedia() {
      mediaLoadToken += 1;
      image.hidden = true;
      image.classList.remove('is-ready');
      image.removeAttribute('src');
      video.pause();
      video.hidden = true;
      videoControls.hidden = true;
      video.classList.remove('is-ready');
      video.removeAttribute('src');
      video.removeAttribute('poster');
      video.load();
      mediaError.hidden = true;
      body.classList.remove('is-video', 'has-media-error', 'is-zoomed', 'is-dragging');
      view.dragging = false;
    }

    function updateNavigation() {
      const hasMultipleDesigns = navigationList.length > 1;
      previousButton.hidden = !hasMultipleDesigns;
      nextButton.hidden = !hasMultipleDesigns;
      previousButton.disabled = currentPosition <= 0;
      nextButton.disabled = currentPosition >= navigationList.length - 1;
    }

    function showDesign(position) {
      if (position < 0 || position >= navigationList.length) return;
      currentPosition = position;
      const design = navigationList[currentPosition];
      currentDesign = design;
      title.textContent = design.name;
      group.textContent = designGroups(design).map(groupDisplayName).join(' · ');
      resetMedia();
      const loadToken = mediaLoadToken;

      if (isVideoDesign(design)) {
        const source = designMediaSource(design);
        const poster = designPosterSource(design);
        body.classList.add('is-video');
        video.hidden = false;
        videoControls.hidden = false;
        video.setAttribute('aria-label', design.name);
        if (poster) video.poster = poster;
        const finishVideoLoading = () => {
          if (loadToken !== mediaLoadToken) return;
          updateVideoControls();
          requestAnimationFrame(() => video.classList.add('is-ready'));
        };
        video.addEventListener('loadedmetadata', finishVideoLoading, { once: true, signal: controller.signal });
        video.addEventListener('canplay', finishVideoLoading, { once: true, signal: controller.signal });
        video.addEventListener('error', () => {
          if (loadToken !== mediaLoadToken) return;
          mediaError.hidden = false;
          body.classList.add('has-media-error');
        }, { once: true, signal: controller.signal });
        video.src = source;
        video.load();
        video.play().catch(() => {});
        updateNavigation();
        return;
      }

      image.hidden = false;
      image.alt = design.name;

      let fitted = false;
      const finishLoading = () => {
        if (fitted || loadToken !== mediaLoadToken) return;
        fitted = true;
        fitImage();
        requestAnimationFrame(() => image.classList.add('is-ready'));
      };
      image.addEventListener('load', finishLoading, { once: true, signal: controller.signal });
      image.src = designMediaSource(design);
      if (image.complete) requestAnimationFrame(finishLoading);
      updateNavigation();
    }

    function zoomAt(clientX, clientY, nextScale) {
      const rect = body.getBoundingClientRect();
      const pointerX = clientX - rect.left;
      const pointerY = clientY - rect.top;
      const imageX = (pointerX - view.x) / view.scale;
      const imageY = (pointerY - view.y) / view.scale;
      view.scale = Math.max(Math.max(.02, view.fitScale * .25), Math.min(8, nextScale));
      view.x = pointerX - imageX * view.scale;
      view.y = pointerY - imageY * view.scale;
      applyView();
    }

    function closeLightbox() {
      if (isClosing) return;
      isClosing = true;
      video.pause();
      controller.abort();
      box.classList.add('is-closing');
      box.classList.remove('is-open');
      const exitDuration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320;
      setTimeout(() => box.remove(), exitDuration);
    }

    video.addEventListener('click', toggleVideoPlayback, { signal: controller.signal });
    video.addEventListener('play', updateVideoControls, { signal: controller.signal });
    video.addEventListener('pause', updateVideoControls, { signal: controller.signal });
    video.addEventListener('timeupdate', updateVideoControls, { signal: controller.signal });
    video.addEventListener('durationchange', updateVideoControls, { signal: controller.signal });
    video.addEventListener('volumechange', updateVideoControls, { signal: controller.signal });
    videoPlayButton.addEventListener('click', toggleVideoPlayback, { signal: controller.signal });
    videoProgress.addEventListener('input', () => {
      if (Number.isFinite(video.duration)) video.currentTime = (Number(videoProgress.value) / 100) * video.duration;
    }, { signal: controller.signal });
    videoMuteButton.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) video.volume = .5;
    }, { signal: controller.signal });
    videoVolume.addEventListener('input', () => {
      video.volume = Number(videoVolume.value);
      video.muted = video.volume === 0;
    }, { signal: controller.signal });
    videoFullscreenButton.addEventListener('click', requestVideoFullscreen, { signal: controller.signal });

    body.addEventListener('wheel', event => {
      if (isVideoDesign(currentDesign)) return;
      event.preventDefault();
      zoomAt(event.clientX, event.clientY, view.scale * Math.exp(-event.deltaY * .0015));
    }, { passive: false, signal: controller.signal });
    body.addEventListener('pointerdown', event => {
      if (isVideoDesign(currentDesign) || event.button !== 0 || !body.classList.contains('is-zoomed')) return;
      view.dragging = true;
      view.pointerStartedOnImage = event.target === image;
      view.startX = event.clientX;
      view.startY = event.clientY;
      view.originX = view.x;
      view.originY = view.y;
      body.classList.add('is-dragging');
      body.setPointerCapture(event.pointerId);
    }, { signal: controller.signal });
    body.addEventListener('pointermove', event => {
      if (!view.dragging) return;
      view.x = view.originX + event.clientX - view.startX;
      view.y = view.originY + event.clientY - view.startY;
      applyView();
    }, { signal: controller.signal });
    body.addEventListener('pointerup', () => {
      view.dragging = false;
      body.classList.remove('is-dragging');
      setTimeout(() => { view.pointerStartedOnImage = false; }, 0);
    }, { signal: controller.signal });
    body.addEventListener('pointercancel', () => {
      view.dragging = false;
      view.pointerStartedOnImage = false;
      body.classList.remove('is-dragging');
    }, { signal: controller.signal });
    body.addEventListener('click', event => {
      if (event.target === body && !view.pointerStartedOnImage) closeLightbox();
    }, { signal: controller.signal });
    body.addEventListener('dblclick', event => {
      if (isVideoDesign(currentDesign)) {
        if (event.target === video) requestVideoFullscreen();
        return;
      }
      fitImage();
    }, { signal: controller.signal });
    previousButton.addEventListener('click', () => showDesign(currentPosition - 1), { signal: controller.signal });
    nextButton.addEventListener('click', () => showDesign(currentPosition + 1), { signal: controller.signal });
    box.querySelector('.lightbox-close').addEventListener('click', closeLightbox, { signal: controller.signal });
    addEventListener('keydown', event => {
      if (event.key === 'Escape') closeLightbox();
      if (isVideoDesign(currentDesign) && document.activeElement === video && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) return;
      if (event.key === 'ArrowLeft' && !previousButton.disabled) {
        event.preventDefault();
        showDesign(currentPosition - 1);
      }
      if (event.key === 'ArrowRight' && !nextButton.disabled) {
        event.preventDefault();
        showDesign(currentPosition + 1);
      }
    }, { signal: controller.signal });
    addEventListener('resize', fitImage, { signal: controller.signal });

    document.body.appendChild(box);
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('is-open')));
    showDesign(currentPosition);
  }
  function toast(message) { const el=document.createElement('div'); el.className='toast'; el.textContent=message; document.body.appendChild(el); setTimeout(()=>el.remove(),2100); }

  function isProtectedLibraryMedia(target) {
    return target instanceof Element && target.matches('#app img, #app video, .lightbox img, .lightbox video');
  }

  document.addEventListener('contextmenu', event => {
    if (isProtectedLibraryMedia(event.target)) event.preventDefault();
  }, { capture: true });

  document.addEventListener('dragstart', event => {
    if (isProtectedLibraryMedia(event.target)) event.preventDefault();
  }, { capture: true });

  async function route() {
    const requestId = ++routeRequestId;
    immersiveParticleCleanup?.();
    immersiveParticleCleanup = null;
    immersiveCursorCleanup?.();
    immersiveCursorCleanup = null;
    viewMode = new URLSearchParams(location.search).get('mode') === 'immersive' ? 'immersive' : 'traditional';
    if (location.hash.startsWith('#project/')) {
      const projectId = decodeURIComponent(location.hash.slice('#project/'.length).split('/')[0]);
      const projectMetadata = libraryData.projects.find(project => project.id === projectId && !deletedLibraryProjects.has(String(project.id)));
      if (!projectMetadata) {
        location.hash = '#library';
        return;
      }
      if (!Array.isArray(projectMetadata.designs)) {
        renderProjectDataStatus(projectMetadata);
        try {
          await loadProjectDesigns(projectMetadata);
        } catch (error) {
          if (requestId === routeRequestId) renderProjectDataStatus(projectMetadata, error instanceof Error ? error.message : '设计稿数据加载失败');
          return;
        }
        if (requestId !== routeRequestId) return;
      }
      if (!activateProject(projectId)) {
        location.hash = '#library';
        return;
      }
      project();
    } else library();
  }
  addEventListener('hashchange', route);
  addEventListener('popstate', route);
  route();
  finishInitialLibraryBoot();
  if (enteredFromPortfolio && viewMode === 'immersive') {
    const url = new URL(location.href);
    url.searchParams.delete('entry');
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }
})();
