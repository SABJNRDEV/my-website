// scroll progress fill on the nav pipeline bar
const scrollFill = document.getElementById('scrollFill');
if (scrollFill) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollFill.style.width = pct + '%';
  });
}

// request form — submits to Formspree
const form = document.getElementById('requestForm');
const msg = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'sending...';
    msg.className = 'form-msg';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        const successPanel = document.getElementById('successPanel');
        if (successPanel) {
          form.style.display = 'none';
          successPanel.style.display = 'block';
        } else {
          msg.textContent = "✓ Sent — you'll hear back soon.";
          msg.classList.add('ok');
        }
      } else {
        throw new Error('submission failed');
      }
    } catch (err) {
      msg.textContent = 'Something went wrong — please try again.';
      msg.classList.add('err');
    }
  });
}
