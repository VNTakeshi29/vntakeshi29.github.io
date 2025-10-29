// Clean script (ASCII only) to avoid encoding issues
// Theme toggle with localStorage
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') root.classList.add('light');
  if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.classList.add('light');
  }
  const preset = localStorage.getItem('themePreset') || 'blue';
  document.documentElement.setAttribute('data-theme', preset);
})();

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const root = document.documentElement;
  const isLight = root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('aria-label', isLight ? 'Switch to dark' : 'Switch to light');
});

// Removed FX toggle button (effects stay on by default)

// Theme preset cycle removed (kept last selected preset)

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
navToggle?.addEventListener('click', () => {
  const header = document.querySelector('.site-header');
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  header?.classList.toggle('open');
});

// IntersectionObserver reveal
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) e.target.classList.add('visible');
}, { threshold: 0.2 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Click on email to copy
(() => {
  const link = document.getElementById('emailLink');
  if (!link) return;
  link.title = 'Click to copy email';
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = link.textContent?.trim() || '';
    try { await navigator.clipboard.writeText(email); showToast('Copied email: ' + email, { variant: 'success', timeout: 2200 }); }
    catch { showToast('Copy failed — please try manually.', { variant: 'warn', timeout: 2600 }); }
  });
})();

// Portfolio: live summary from external status page
(async () => {
  const summaryEl = document.getElementById('statusSummary');
  const badgeEl = document.getElementById('statusBadge');
  if (!summaryEl || !badgeEl) return;
  try {
    const res = await fetch('/service-status/status.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('http');
    const data = await res.json();
    let up = 0, down = 0, warn = 0;
    for (const c of (data.checks || [])) {
      if (c.ok) up++; else if (c.warn) warn++; else down++;
    }
    if (down === 0 && warn === 0) {
      summaryEl.textContent = 'All systems operational';
      badgeEl.textContent = 'Operational';
      badgeEl.classList.add('status-active');
    } else if (down === 0 && warn > 0) {
      summaryEl.textContent = 'Degraded performance';
      badgeEl.textContent = 'Degraded';
      badgeEl.classList.add('status-webdown');
    } else {
      summaryEl.textContent = 'Partial outage';
      badgeEl.textContent = 'Outage';
      badgeEl.classList.add('status-stop');
    }
  } catch {
    summaryEl.textContent = 'Status unavailable';
    badgeEl.textContent = 'Unknown';
  }
})();

 

// Footer year
document.getElementById('year').textContent = String(new Date().getFullYear());

// Toast utility
function ensureToastHost() {
  let host = document.querySelector('.toast-container');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toast-container';
    document.body.appendChild(host);
  }
  return host;
}

function showToast(message, { variant = 'info', timeout = 3000 } = {}) {
  const host = ensureToastHost();
  const el = document.createElement('div');
  el.className = `toast ${variant}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML = `
    <span class="msg">${message}</span>
    <button class="close" aria-label="Close">x</button>
  `;
  const close = () => { el.classList.add('hide'); setTimeout(() => el.remove(), 180); };
  el.querySelector('.close').addEventListener('click', close);
  host.appendChild(el);
  if (timeout > 0) setTimeout(close, timeout);
}

// Modal utility
function ensureModalHost() {
  let host = document.getElementById('modalHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'modalHost';
    host.innerHTML = `
      <div class="modal-backdrop" id="modalBackdrop" aria-hidden="true">
        <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <header>
            <h3 id="modalTitle">Details</h3>
            <button class="close" id="modalClose" aria-label="Close">x</button>
          </header>
          <div class="modal-body" id="modalBody"></div>
        </section>
      </div>`;
    document.body.appendChild(host);
    document.getElementById('modalClose').addEventListener('click', hideModal);
    document.getElementById('modalBackdrop').addEventListener('click', (e) => {
      if (e.target.id === 'modalBackdrop') hideModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });
  }
  return host;
}

function showModal({ title, roles, domains, notes }) {
  ensureModalHost();
  const backdrop = document.getElementById('modalBackdrop');
  document.getElementById('modalTitle').textContent = title || 'Details';
  const body = document.getElementById('modalBody');
  const domText = domains ? `<div class="row"><strong>Domain:</strong> <span id="domainsText">${domains}</span> <button class="copy-mini" id="copyDomains" type="button">Copy</button></div>` : '';
  const roleText = roles ? `<div class="row"><strong>Role:</strong> ${roles}</div>` : '';
  const noteText = notes ? `<div class="row"><strong>Status:</strong> ${notes}</div>` : '';
  body.innerHTML = `${roleText}${domText}${noteText}` || '<div class="row">No info</div>';
  backdrop.classList.add('show');
  backdrop.setAttribute('aria-hidden', 'false');
  document.getElementById('copyDomains')?.addEventListener('click', async () => {
    const t = document.getElementById('domainsText')?.textContent?.trim() || '';
    try { await navigator.clipboard.writeText(t); showToast('Copied domains', { variant: 'success', timeout: 2000 }); }
    catch { showToast('Copy failed', { variant: 'warn' }); }
  });
}

function hideModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
    backdrop.setAttribute('aria-hidden', 'true');
  }
}

// Attach handlers for project details
document.querySelectorAll('a.details').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const { title, roles, domains, notes } = link.dataset;
    showModal({ title, roles, domains, notes });
  });
  // Add inline Copy button next to Details (copy domains)
  if (link.dataset.domains && !link.nextElementSibling?.classList?.contains('copy-mini')) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-mini';
    btn.textContent = 'Copy';
    btn.title = 'Copy domains';
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try { await navigator.clipboard.writeText(link.dataset.domains); showToast('Copied domains', { variant: 'success', timeout: 1500 }); }
      catch { showToast('Copy failed', { variant: 'warn' }); }
    });
    link.insertAdjacentElement('afterend', btn);
  }
});

// Highlight badges
document.querySelectorAll('.badges span').forEach(s => {
  const t = (s.textContent || '').toLowerCase();
  if (t.includes('discontinued') || t.includes('stopped')) s.classList.add('status-stop');
  if (t.includes('active')) s.classList.add('status-active');
  if (t.includes('commercial')) s.classList.add('status-commercial');
  if (t.includes('website discontinued')) s.classList.add('status-webdown');
  if (t.includes('automation')) s.classList.add('status-automation');
  // Auto tooltip for common tags
  if (!s.title) {
    if (t.includes('commercial')) s.title = 'Commercial project';
    else if (t.includes('website discontinued')) s.title = 'Website is no longer running';
    else if (t.includes('discontinued')) s.title = 'Project discontinued';
    else if (t.includes('active')) s.title = 'Project is active';
    else if (t.includes('ops')) s.title = 'Operations';
    else if (t.includes('automation')) s.title = 'Automation / tools';
  }
});

// Scroll progress + back to top
(() => {
  const bar = document.querySelector('#scrollProgress i');
  const topBtn = document.getElementById('backTop');
  const onScroll = () => {
    const scrolled = window.scrollY;
    const h = document.documentElement;
    const pct = Math.min(100, Math.max(0, (scrolled / (h.scrollHeight - h.clientHeight)) * 100));
    if (bar) bar.style.width = pct + '%';
    if (topBtn) topBtn.classList.toggle('show', scrolled > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  // keyboard shortcut: press 'b' to go top
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();

// Stats counters (animate when visible) + Discord members/online
(() => {
  const els = document.querySelectorAll('.stats strong');
  if (!els.length) return;
  const fmt = (n, suf) => n.toLocaleString(undefined) + (suf || '');
  const run = (el) => {
    const target = Number(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    if (!target) { return; }
    const dur = 900; const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const val = Math.floor(target * p);
      el.textContent = fmt(val, p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  async function fillDiscordCounts(updateDirect = false) {
    const items = document.querySelectorAll('strong[data-discord-invite]');
    await Promise.all(Array.from(items).map(async (el) => {
      const code = el.getAttribute('data-discord-invite');
      try {
        const res = await fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true&with_expiration=true`);
        if (!res.ok) throw new Error('http');
        const data = await res.json();
        const field = (el.getAttribute('data-field') || 'members').toLowerCase();
        const approxMembers = data.approximate_member_count || data.member_count || 0;
        const approxOnline = data.approximate_presence_count || 0;
        const val = field === 'online' ? approxOnline : approxMembers;
        if (val > 0) {
          const prev = Number(el.getAttribute('data-count') || '0');
          el.setAttribute('data-count', String(val));
          if (updateDirect) {
            const suffix = el.getAttribute('data-suffix') || '';
            el.textContent = fmt(val, suffix);
            // delta arrow
            const li = el.closest('li');
            if (li) {
              let d = li.querySelector('em.delta');
              if (!d) { d = document.createElement('em'); d.className = 'delta'; el.insertAdjacentElement('afterend', d); }
              const diff = val - prev;
              if (diff > 0) { d.textContent = ' ▲'; d.className = 'delta up'; }
              else if (diff < 0) { d.textContent = ' ▼'; d.className = 'delta down'; }
              else { d.textContent = ''; d.className = 'delta'; }
            }
          }
        }
      } catch {}
    }));
  }
  fillDiscordCounts(false).finally(() => {
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('strong').forEach(run); io2.unobserve(e.target); } });
    }, { threshold: .3 });
    document.querySelectorAll('.stats').forEach(s => io2.observe(s));
  });
  // Auto refresh every 60s (update in place, no animation)
  setInterval(() => { fillDiscordCounts(true); }, 60000);
})();

// Command Palette (Ctrl/Cmd+K or /)
(() => {
  const host = document.getElementById('cmdk');
  const input = document.getElementById('cmdkInput');
  const list = document.getElementById('cmdkList');
  if (!host || !input || !list) return;

  const commands = [
    { label: 'Go to: About', action: () => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go to: Projects', action: () => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go to: Skills', action: () => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go to: Experience', action: () => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go to: Contact', action: () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Toggle: Theme', action: () => document.getElementById('themeToggle').click() },
    { label: 'Open: Discord (APT)', action: () => window.open('https://discord.gg/qGKQV4sReE','_blank') },
    { label: 'Open: Discord (Gaming Chair)', action: () => window.open('https://discord.gg/BW9qD66m5p','_blank') },
    { label: 'Open: YouTube', action: () => window.open('https://www.youtube.com/@NightOwlTGT','_blank') },
    { label: 'Copy: Email', action: async () => { try { await navigator.clipboard.writeText('vntakeshii@gmail.com'); showToast('Copied email', { variant:'success', timeout:1200 }); } catch{} } },
    { label: 'Copy: Username', action: async () => { try { await navigator.clipboard.writeText('vntakeshii'); showToast('Copied username', { variant:'success', timeout:1200 }); } catch{} } },
  ];

  function render(items){
    list.innerHTML = '';
    items.forEach((c, i) => {
      const li = document.createElement('li');
      li.textContent = c.label; if (i === 0) li.classList.add('active');
      li.addEventListener('click', () => { c.action(); hide(); });
      list.appendChild(li);
    });
  }
  function show(){ host.classList.add('show'); host.setAttribute('aria-hidden','false'); input.value=''; render(commands); input.focus(); }
  function hide(){ host.classList.remove('show'); host.setAttribute('aria-hidden','true'); }

  document.addEventListener('keydown', (e) => {
    const isK = (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey));
    const isSlash = (e.key === '/' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT');
    if (isK || isSlash) { e.preventDefault(); show(); }
    if ((e.key.toLowerCase() === 'g') && !e.metaKey && !e.ctrlKey && !e.altKey) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    if (e.key === 'Escape' && host.classList.contains('show')) hide();
  });
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    const filtered = commands.filter(c => c.label.toLowerCase().includes(q));
    render(filtered.length ? filtered : [{ label: 'No results', action: hide }]);
  });
})();

// Scrollspy for nav active state
(() => {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const id = '#' + e.target.id;
      const link = links.find(a => a.getAttribute('href') === id);
      if (link) link.classList.toggle('active', e.isIntersecting && e.intersectionRatio > 0.5);
    });
  }, { threshold: [0.5] });
  sections.forEach(sec => spy.observe(sec));
})();
