// scroll progress fill on the nav pipeline bar
const scrollFill = document.getElementById('scrollFill');
if (scrollFill) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollFill.style.width = pct + '%';
  });
}

// request form + admin panel only exist on index.html
const form = document.getElementById('requestForm');
const msg = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'sending...';
    msg.className = 'form-msg';

    const entry = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      type: document.getElementById('type').value,
      budget: document.getElementById('budget').value,
      details: document.getElementById('details').value,
      submittedAt: new Date().toISOString()
    };

    try {
      const key = 'request:' + Date.now();
      const result = await window.storage.set(key, JSON.stringify(entry), true);
      if (result) {
        msg.textContent = "✓ Sent — you'll hear back soon.";
        msg.classList.add('ok');
        form.reset();
      } else {
        throw new Error('save failed');
      }
    } catch (err) {
      msg.textContent = 'Something went wrong — please try again.';
      msg.classList.add('err');
    }
  });
}

// simple admin viewer (only exists on index.html)
const overlay = document.getElementById('adminOverlay');
const adminOpen = document.getElementById('adminOpen');
if (overlay && adminOpen) {
  adminOpen.addEventListener('click', async (e) => {
    e.preventDefault();
    const entered = prompt('Enter passcode to view requests:');
    if (entered !== 'Smart&2008') {
      if (entered !== null) alert('Wrong passcode.');
      return;
    }
    overlay.classList.add('open');
    const list = document.getElementById('adminList');
    list.innerHTML = 'Loading...';
    try {
      const keys = await window.storage.list('request:', true);
      if (!keys || !keys.keys || keys.keys.length === 0) {
        list.innerHTML = '<p style="color:var(--ink-soft);font-size:14px;">No requests yet.</p>';
        return;
      }
      const entries = [];
      for (const k of keys.keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r) entries.push(JSON.parse(r.value));
        } catch (err) { }
      }
      entries.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      list.innerHTML = entries.map(en => `
      <div class="admin-entry">
        <div class="a-name">${en.name} — ${en.type}</div>
        <div class="a-meta">${en.email} · ${en.budget} · ${new Date(en.submittedAt).toLocaleString()}</div>
        <div>${en.details}</div>
      </div>
    `).join('');
    } catch (err) {
      list.innerHTML = "<p style=\"color:var(--ink-soft);font-size:14px;\">Couldn't load requests.</p>";
    }
  });
  document.getElementById('adminClose').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
}
