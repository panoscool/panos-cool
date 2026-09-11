/* ============================================================================
   panoscool — page behaviour
   Theme switching, content rendering, the hero console and a few HUD touches.
   Everything degrades gracefully: without JS the page still renders and the
   theme still follows the operating system.
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.PAGE_DATA || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THEME_KEY = 'pc:theme';
  var THEME_COLORS = { light: '#eceff6', dark: '#05070e' };

  /* ── helpers ───────────────────────────────────────────────────────────── */

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* ── theme: light / auto / dark ────────────────────────────────────────── */

  var themeMeta = null;
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function resolvedTheme(mode) {
    if (mode === 'light' || mode === 'dark') return mode;
    return systemDark.matches ? 'dark' : 'light';
  }

  function syncThemeColor(mode) {
    if (!themeMeta) {
      // Replace the two media-scoped tags with one tag this script owns.
      var existing = document.querySelectorAll('meta[name="theme-color"]');
      for (var i = 0; i < existing.length; i++) existing[i].parentNode.removeChild(existing[i]);
      themeMeta = el('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', THEME_COLORS[resolvedTheme(mode)]);
  }

  function applyTheme(mode, persist) {
    root.dataset.themeMode = mode;
    if (mode === 'auto') delete root.dataset.theme;
    else root.dataset.theme = mode;

    syncThemeColor(mode);

    var opts = document.querySelectorAll('[data-theme-set]');
    var thumbIndex = 1;
    for (var i = 0; i < opts.length; i++) {
      var active = opts[i].getAttribute('data-theme-set') === mode;
      opts[i].setAttribute('aria-checked', active ? 'true' : 'false');
      if (active) thumbIndex = i;
    }
    var thumb = document.querySelector('.theme-switch__thumb');
    if (thumb) thumb.style.setProperty('--thumb-x', thumbIndex * 36 + 'px');

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch (e) {
        /* private mode — theme just won't be remembered */
      }
    }
  }

  function initTheme() {
    var mode = 'auto';
    try {
      mode = localStorage.getItem(THEME_KEY) || 'auto';
    } catch (e) {}
    if (['light', 'dark', 'auto'].indexOf(mode) === -1) mode = 'auto';

    applyTheme(mode, false);

    var switchEl = document.querySelector('.theme-switch');
    if (switchEl) {
      switchEl.addEventListener('click', function (event) {
        var btn = event.target.closest('[data-theme-set]');
        if (btn) applyTheme(btn.getAttribute('data-theme-set'), true);
      });

      // Left/right arrows move through the three options, like a real radiogroup.
      switchEl.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        var opts = Array.prototype.slice.call(switchEl.querySelectorAll('[data-theme-set]'));
        var current = opts.indexOf(document.activeElement);
        if (current === -1) return;
        event.preventDefault();
        var next = (current + (event.key === 'ArrowRight' ? 1 : -1) + opts.length) % opts.length;
        opts[next].focus();
        applyTheme(opts[next].getAttribute('data-theme-set'), true);
      });
    }

    var onSystemChange = function () {
      if ((root.dataset.themeMode || 'auto') === 'auto') syncThemeColor('auto');
    };
    if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);
    else if (systemDark.addListener) systemDark.addListener(onSystemChange);
  }

  /* ── app cards ─────────────────────────────────────────────────────────── */

  var LAUNCH_ARROW =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M7 17 17 7M9.5 7H17v7.5"/></svg>';

  function appCard(app, index) {
    var card = el('article', 'app-card reveal');
    card.style.setProperty('--d', index * 90 + 'ms');
    if (app.accent) card.style.setProperty('--card-accent', app.accent);

    var icon = app.logo
      ? '<img src="' + escapeHtml(app.logo) + '" alt="" loading="lazy" />'
      : app.icon || '';

    var tags = (app.tags || [])
      .slice(0, 3)
      .map(function (tag) {
        return '<li>' + escapeHtml(tag) + '</li>';
      })
      .join('');

    card.innerHTML =
      '<span class="app-card__idx" aria-hidden="true">' + pad(index + 1) + '</span>' +
      '<div class="app-card__icon" aria-hidden="true">' + icon + '</div>' +
      '<h3 class="app-card__title">' + escapeHtml(app.title) + '</h3>' +
      (app.tagline ? '<p class="app-card__tagline">' + escapeHtml(app.tagline) + '</p>' : '') +
      (app.description ? '<p class="app-card__desc">' + escapeHtml(app.description) + '</p>' : '') +
      (tags ? '<ul class="app-card__tags">' + tags + '</ul>' : '') +
      '<div class="app-card__foot">' +
      '<span class="app-card__host"><span class="dot dot--live"></span><span>' +
      escapeHtml(app.host || '') +
      '</span></span>' +
      '<a class="btn app-card__launch" href="' + escapeHtml(app.url) + '"' +
      ' target="_blank" rel="noopener noreferrer"' +
      ' aria-label="Launch ' + escapeHtml(app.title) + ' (opens in a new tab)">' +
      '<span>Launch</span>' + LAUNCH_ARROW + '</a>' +
      '</div>';

    // If a logo image fails to load, fall back to the inline SVG icon.
    var img = card.querySelector('.app-card__icon img');
    if (img && app.icon) {
      img.addEventListener('error', function () {
        img.parentNode.innerHTML = app.icon;
      });
    }

    return card;
  }

  function renderApps() {
    var grid = document.getElementById('app-grid');
    if (!grid || !DATA.apps) return;
    var frag = document.createDocumentFragment();
    DATA.apps.forEach(function (app, i) {
      frag.appendChild(appCard(app, i));
    });
    grid.appendChild(frag);
  }

  function renderPackages() {
    var list = document.getElementById('pkg-list');
    var section = document.getElementById('packages');
    if (!list || !section) return;
    if (!DATA.packages || !DATA.packages.length) {
      section.remove();
      return;
    }
    DATA.packages.forEach(function (pkg) {
      var link = el('a', 'pkg');
      link.href = pkg.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML =
        '<span class="pkg__mark" aria-hidden="true">npm</span>' +
        '<span><span class="pkg__name">' + escapeHtml(pkg.name) + '</span>' +
        '<span class="pkg__desc">' + escapeHtml(pkg.description || '') + '</span></span>';
      list.appendChild(link);
    });
  }

  function applyLinks() {
    var links = DATA.links || {};
    var map = { 'github-link': links.github, 'coffee-link': links.coffee };
    Object.keys(map).forEach(function (id) {
      var node = document.getElementById(id);
      if (node && map[id]) node.href = map[id];
    });
  }

  /* ── hero console ──────────────────────────────────────────────────────── */

  function runConsole() {
    var body = document.getElementById('console-body');
    var lines = DATA.console;
    if (!body || !lines || !lines.length) return;

    var done = [];

    function paint(partial) {
      var html = done.join('\n');
      if (partial != null) html += (html ? '\n' : '') + partial;
      body.innerHTML = html + '<span class="caret"></span>';
    }

    function lineHtml(line, text) {
      if (line.cmd != null) {
        return '<span class="c-prompt">$ </span><span class="c-cmd">' + escapeHtml(text) + '</span>';
      }
      return '<span class="c-out">' + escapeHtml(text) + '</span>';
    }

    if (reduceMotion) {
      done = lines.map(function (line) {
        return lineHtml(line, line.cmd != null ? line.cmd : line.out);
      });
      paint();
      return;
    }

    var li = 0;
    var ci = 0;

    function step() {
      if (li >= lines.length) return;
      var line = lines[li];
      var text = line.cmd != null ? line.cmd : line.out;

      if (line.cmd == null) {
        // Responses print at once, after a beat.
        done.push(lineHtml(line, text));
        paint();
        li += 1;
        setTimeout(step, 420);
        return;
      }

      ci += 1;
      paint(lineHtml(line, text.slice(0, ci)));
      if (ci >= text.length) {
        done.push(lineHtml(line, text));
        li += 1;
        ci = 0;
        setTimeout(step, 340);
      } else {
        setTimeout(step, 26 + Math.random() * 38);
      }
    }

    paint();
    setTimeout(step, 600);
  }

  /* ── HUD touches: progress rail, pointer glow, card spotlight, reveal ──── */

  function initScrollRail() {
    var bar = document.getElementById('scroll-bar');
    if (!bar) return;
    var queued = false;

    function update() {
      queued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  function initPointerGlow() {
    if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
    var queued = false;
    var x = 0;
    var y = 0;

    function update() {
      queued = false;
      root.style.setProperty('--mx', x + 'px');
      root.style.setProperty('--my', y + 'px');
    }

    window.addEventListener(
      'pointermove',
      function (event) {
        x = event.clientX;
        y = event.clientY;
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
  }

  function initCardSpotlight() {
    var grid = document.getElementById('app-grid');
    if (!grid || !window.matchMedia('(hover: hover)').matches) return;
    grid.addEventListener(
      'pointermove',
      function (event) {
        var card = event.target.closest('.app-card');
        if (!card) return;
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--cx', (event.clientX - rect.left).toFixed(1) + 'px');
        card.style.setProperty('--cy', (event.clientY - rect.top).toFixed(1) + 'px');
      },
      { passive: true }
    );
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  function initYear() {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ── boot ──────────────────────────────────────────────────────────────── */

  function boot() {
    initTheme();
    applyLinks();
    renderApps();
    renderPackages();
    initReveal();
    initScrollRail();
    initPointerGlow();
    initCardSpotlight();
    initYear();
    runConsole();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
