(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Opening typing sequence ---------- */
  const intro = document.getElementById('intro');
  const typed = document.getElementById('typed');
  const LINE = 'Every intelligent system begins with a problem worth solving.';

  function finishIntro() {
    intro.classList.add('done');
    document.body.style.overflow = '';
    setTimeout(() => intro.remove(), 1600);
  }

  if (reducedMotion || !intro) {
    if (intro) intro.remove();
  } else {
    document.body.style.overflow = 'hidden';
    let i = 0;
    setTimeout(function type() {
      if (!document.body.contains(intro)) return;
      if (i < LINE.length) {
        typed.textContent += LINE.charAt(i++);
        setTimeout(type, 42);
      } else {
        setTimeout(finishIntro, 1400);
      }
    }, 900);
    intro.addEventListener('click', finishIntro);
  }

  /* ---------- Scroll reveal ---------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (idx % 6) * 90 + 'ms';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  /* ---------- Project screenshots (use real image if present) ---------- */
  document.querySelectorAll('img.shot-img').forEach((img) => {
    img.addEventListener('load', () => {
      img.hidden = false;
      const mock = img.closest('.shot').querySelector('.mockup');
      if (mock) mock.hidden = true;
    });
    img.addEventListener('error', () => img.remove());
    img.src = img.dataset.src;
  });

  /* ---------- Interactive skill graph ---------- */
  function buildSkillGraph() {
    const host = document.getElementById('skillgraph');
    if (!host) return;

    const DOMAINS = [
      { name: 'Languages', skills: ['Java', 'Python', 'JavaScript', 'SQL'] },
      { name: 'Frontend', skills: ['Angular', 'React', 'TypeScript', 'HTML', 'CSS'] },
      { name: 'Backend', skills: ['Spring Boot', 'Node.js', 'REST APIs', 'Auth Systems'] },
      { name: 'Databases', skills: ['MySQL', 'MongoDB'] },
      { name: 'Tools', skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Architecture'] },
    ];

    const NS = 'http://www.w3.org/2000/svg';
    const W = 1000, H = 720, CX = W / 2, CY = H / 2;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    function line(parent, x1, y1, x2, y2, cls) {
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1);
      l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('class', cls);
      parent.appendChild(l);
    }

    function pill(parent, x, y, text, cls) {
      const w = text.length * 7.4 + 30;
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x - w / 2);
      r.setAttribute('y', y - 16);
      r.setAttribute('width', w);
      r.setAttribute('height', 32);
      r.setAttribute('rx', 16);
      r.setAttribute('class', 'sg-pill ' + cls);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x);
      t.setAttribute('y', y);
      t.setAttribute('class', 'sg-text ' + cls);
      t.textContent = text;
      parent.appendChild(r);
      parent.appendChild(t);
    }

    const trunk = document.createElementNS(NS, 'g');
    svg.appendChild(trunk);

    DOMAINS.forEach((d, i) => {
      const ang = (i / DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
      const dx = CX + Math.cos(ang) * 295;
      const dy = CY + Math.sin(ang) * 205;

      line(trunk, CX, CY, dx, dy, 'sg-link main');

      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'sg-domain');
      g.setAttribute('tabindex', '0');

      const spread = Math.PI / 2.1;
      d.skills.forEach((s, j) => {
        const n = d.skills.length;
        const a = n === 1 ? ang : ang - spread / 2 + (j / (n - 1)) * spread;
        const sx = dx + Math.cos(a) * 150;
        const sy = dy + Math.sin(a) * 100;
        line(g, dx, dy, sx, sy, 'sg-link');
        pill(g, sx, sy, s, 'skill');
      });

      pill(g, dx, dy, d.name, 'domain');

      function focus() { svg.classList.add('focused'); g.classList.add('focus'); }
      function blur() { svg.classList.remove('focused'); g.classList.remove('focus'); }
      g.addEventListener('mouseenter', focus);
      g.addEventListener('mouseleave', blur);
      g.addEventListener('focusin', focus);
      g.addEventListener('focusout', blur);
      g.addEventListener('click', () => {
        if (g.classList.contains('focus')) blur(); else focus();
      });

      svg.appendChild(g);
    });

    const center = document.createElementNS(NS, 'g');
    pill(center, CX, CY, 'GOPAL · ENGINEERING', 'center');
    svg.appendChild(center);

    host.appendChild(svg);
  }
  buildSkillGraph();

  /* ---------- Contribution graph (stylized) ---------- */
  const contrib = document.getElementById('contrib');
  if (contrib) {
    const weeks = 52;
    const frag = document.createDocumentFragment();
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const cell = document.createElement('i');
        const wave = (Math.sin(w / 5) + 1) / 2;
        const a = Math.random() < 0.25 ? 0.06 : 0.12 + wave * Math.random() * 0.85;
        cell.style.setProperty('--a', a.toFixed(2));
        frag.appendChild(cell);
      }
    }
    contrib.appendChild(frag);
  }

  /* ---------- Hero network canvas ---------- */
  const canvas = document.getElementById('network');
  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let w, h, raf;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const LINK = 130;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            ctx.strokeStyle = 'rgba(94, 234, 212,' + (0.14 * (1 - dist / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(232, 236, 244, 0.5)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);

    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting) frame();
      });
    }).observe(canvas);
  }
})();
