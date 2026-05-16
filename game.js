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
  const CLICK_FLEE_FRAMES = 22;
  const CLICK_FLEE_SPEED = 9;
  const HOVER_PAD = 100;
  const CLICK_PAD = 120;

  function measure() {
    const rect = logo.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }

  function bounds(pad = 0) {
    return {
      left: x - pad,
      top: y - pad,
      right: x + width + pad,
      bottom: y + height + pad,
    };
  }

  function isOverLogo(px, py, pad = HOVER_PAD) {
    const b = bounds(pad);
    return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
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

  function emergencyTeleport(awayX, awayY) {
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;
    const minY = 88;
    const spots = [
      [padding, minY + padding],
      [maxX - padding, minY + padding],
      [padding, maxY - padding],
      [maxX - padding, maxY - padding],
      [maxX / 2, minY + padding],
      [maxX / 2, maxY - padding],
      [padding, (minY + maxY) / 2],
      [maxX - padding, (minY + maxY) / 2],
    ];

    let best = spots[0];
    let bestDist = -1;

    for (const [sx, sy] of spots) {
      const cx = sx + width / 2;
      const cy = sy + height / 2;
      const d = Math.hypot(cx - awayX, cy - awayY);
      if (d > bestDist) {
        bestDist = d;
        best = [sx, sy];
      }
    }

    x = best[0];
    y = best[1];

    const cx = x + width / 2;
    const cy = y + height / 2;
    const dx = cx - awayX;
    const dy = cy - awayY;
    const dist = Math.hypot(dx, dy) || 1;
    vx = (dx / dist) * CLICK_FLEE_SPEED;
    vy = (dy / dist) * CLICK_FLEE_SPEED;
    fleeCooldown = CLICK_FLEE_FRAMES;
    render();
  }

  function enforceUntouchable(px, py) {
    if (isOverLogo(px, py, HOVER_PAD)) {
      emergencyTeleport(px, py);
      return true;
    }
    return false;
  }

  function fleeFromCursor() {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const dx = cx - mouseX;
    const dy = cy - mouseY;
    const dist = Math.hypot(dx, dy);
    const dangerRadius = Math.max(width, height) * 2.8;

    if (dist < dangerRadius && dist > 0) {
      const force = (dangerRadius - dist) / dangerRadius;
      const push = 22 + force * 36;
      const nx = dx / dist;
      const ny = dy / dist;

      x += nx * push;
      y += ny * push;
      vx += nx * force * 1.2;
      vy += ny * force * 1.2;

      logo.classList.add("near-miss");

      if (dist < dangerRadius * 0.45) {
        enforceUntouchable(mouseX, mouseY);
      }

      if (hintCooldown <= 0 && dist < dangerRadius * 0.55) {
        hint.textContent = hints[Math.floor(Math.random() * hints.length)];
        hintCooldown = 120;
      }
    } else {
      logo.classList.remove("near-miss");
    }
  }

  function fleeFromClick(clientX, clientY) {
    if (isOverLogo(clientX, clientY, CLICK_PAD)) {
      emergencyTeleport(clientX, clientY);
      hint.textContent = "想点我？门都没有。";
      hintCooldown = 90;
      logo.classList.add("flee-burst");
      window.setTimeout(() => logo.classList.remove("flee-burst"), 280);
      return;
    }

    const cx = x + width / 2;
    const cy = y + height / 2;
    const dx = cx - clientX;
    const dy = cy - clientY;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const closeness = Math.max(0, 1 - dist / 520);
    const jump = 220 + closeness * 200 + Math.random() * 100;

    x += nx * jump;
    y += ny * jump;
    vx = nx * CLICK_FLEE_SPEED;
    vy = ny * CLICK_FLEE_SPEED;
    fleeCooldown = CLICK_FLEE_FRAMES;

    logo.classList.add("flee-burst");
    window.setTimeout(() => logo.classList.remove("flee-burst"), 280);

    hint.textContent = closeness > 0.35 ? "想点我？门都没有。" : "你一点，我就飞。";
    hintCooldown = 90;
  }

  function render() {
    logo.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function tick() {
    x += vx;
    y += vy;

    if (fleeCooldown > 0) {
      fleeCooldown -= 1;
      vx *= 0.96;
      vy *= 0.96;
    } else if (Math.random() < 0.004) {
      vx += (Math.random() - 0.5) * 0.4;
      vy += (Math.random() - 0.5) * 0.4;
    }

    const speed = Math.hypot(vx, vy);
    const maxSpeed = fleeCooldown > 0 ? CLICK_FLEE_SPEED : 2.2;
    if (speed > maxSpeed) {
      vx = (vx / speed) * maxSpeed;
      vy = (vy / speed) * maxSpeed;
    }
    if (speed < 0.35 && fleeCooldown <= 0) {
      const angle = Math.random() * Math.PI * 2;
      vx = Math.cos(angle) * 0.6;
      vy = Math.sin(angle) * 0.6;
    }

    fleeFromCursor();
    enforceUntouchable(mouseX, mouseY);
    clampPosition();
    render();

    if (hintCooldown > 0) hintCooldown -= 1;

    requestAnimationFrame(tick);
  }

  function trackPointer(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (e.buttons > 0) {
      enforceUntouchable(mouseX, mouseY);
    }
  }

  document.addEventListener("pointermove", trackPointer, { passive: true });
  document.addEventListener("mousemove", trackPointer, { passive: true });

  document.addEventListener(
    "pointerdown",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      fleeFromClick(e.clientX, e.clientY);
    },
    { capture: true }
  );

  document.addEventListener(
    "click",
    (e) => {
      if (isOverLogo(e.clientX, e.clientY, CLICK_PAD)) {
        e.preventDefault();
        e.stopPropagation();
        emergencyTeleport(e.clientX, e.clientY);
      }
    },
    { capture: true }
  );

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
