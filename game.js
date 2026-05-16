(function () {
  const logo = document.getElementById("logo");
  const hint = document.getElementById("hint");
  const hints = [
    "就差一点点……才怪。",
    "手速不够，它可不会等你。",
    "再近一点？它早溜了。",
    "证明失败，图标拒绝被选中。",
    "光标追得上，图标可不同意。",
  ];

  let x = window.innerWidth * 0.4;
  let y = window.innerHeight * 0.5;
  let vx = 0.55;
  let vy = 0.42;
  let mouseX = -9999;
  let mouseY = -9999;
  let width = 0;
  let height = 0;
  let padding = 72;
  let fleeCooldown = 0;
  let hintCooldown = 0;

  function measure() {
    const rect = logo.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }

  function clampPosition() {
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;
    const minY = 88;

    if (x < padding) {
      x = padding;
      vx = Math.abs(vx);
    }
    if (x > maxX - padding) {
      x = maxX - padding;
      vx = -Math.abs(vx);
    }
    if (y < minY + padding) {
      y = minY + padding;
      vy = Math.abs(vy);
    }
    if (y > maxY - padding) {
      y = maxY - padding;
      vy = -Math.abs(vy);
    }
  }

  function fleeFromCursor() {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const dx = cx - mouseX;
    const dy = cy - mouseY;
    const dist = Math.hypot(dx, dy);
    const dangerRadius = Math.max(width, height) * 1.8;

    if (dist < dangerRadius && dist > 0) {
      const force = (dangerRadius - dist) / dangerRadius;
      const push = 14 + force * 22;
      const nx = dx / dist;
      const ny = dy / dist;

      x += nx * push;
      y += ny * push;
      vx += nx * force * 0.8;
      vy += ny * force * 0.8;

      logo.classList.add("near-miss");

      if (hintCooldown <= 0 && dist < dangerRadius * 0.55) {
        hint.textContent = hints[Math.floor(Math.random() * hints.length)];
        hintCooldown = 120;
      }
    } else {
      logo.classList.remove("near-miss");
    }
  }

  function escapeClick(e) {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const dx = cx - e.clientX;
    const dy = cy - e.clientY;
    const dist = Math.hypot(dx, dy);
    const snapRadius = Math.max(width, height) * 2.5;

    if (dist < snapRadius) {
      const angle = Math.atan2(dy, dx) || Math.random() * Math.PI * 2;
      const jump = 180 + Math.random() * 120;
      x += Math.cos(angle) * jump;
      y += Math.sin(angle) * jump;
      vx = Math.cos(angle) * 2.5;
      vy = Math.sin(angle) * 2.5;
      fleeCooldown = 8;
      hint.textContent = "想点我？门都没有。";
      hintCooldown = 90;
    }
  }

  function render() {
    logo.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function tick() {
    if (fleeCooldown > 0) {
      fleeCooldown -= 1;
    } else {
      x += vx;
      y += vy;

      if (Math.random() < 0.004) {
        vx += (Math.random() - 0.5) * 0.4;
        vy += (Math.random() - 0.5) * 0.4;
      }
    }

    const speed = Math.hypot(vx, vy);
    const maxSpeed = 2.2;
    if (speed > maxSpeed) {
      vx = (vx / speed) * maxSpeed;
      vy = (vy / speed) * maxSpeed;
    }
    if (speed < 0.35) {
      const angle = Math.random() * Math.PI * 2;
      vx = Math.cos(angle) * 0.6;
      vy = Math.sin(angle) * 0.6;
    }

    fleeFromCursor();
    clampPosition();
    render();

    if (hintCooldown > 0) hintCooldown -= 1;

    requestAnimationFrame(tick);
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener("mousedown", escapeClick);
  document.addEventListener("touchstart", (e) => {
    if (e.touches[0]) escapeClick(e.touches[0]);
  }, { passive: true });

  window.addEventListener("resize", () => {
    measure();
    clampPosition();
    render();
  });

  measure();
  x = (window.innerWidth - width) / 2;
  y = window.innerHeight * 0.45;
  render();
  requestAnimationFrame(tick);
})();
