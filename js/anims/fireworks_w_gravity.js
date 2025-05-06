// === js/anims/fireworks_w_gravity.js ===
(() => {
  console.log('[Anim] fireworks_w_gravity.js loaded');

  // === STATE ===
  let fireworkswg = [];
  let gravity = 0.015;
  let fireworkCooldown = 10;
  let cooldownMin = 30;
  let cooldownMax = 60;
  let dotSizeMultiplier = 1;
  let numParticles = 24;
  let shapes = ['burst', 'ring', 'star', 'willow', 'smiley'];
  let shapeMode = 'random'; // 'random' or specific shape like 'burst'

  function createFirework() {
    const x = random(cols) + 0.5;
    const y = rows;
    const vx = 0;
    const vy = -random(0.3, 0.4); // Slower upward motion

    fireworkswg.push({
      type: 'rocket',
      x,
      y,
      vx,
      vy,
      exploded: false,
      trail: []
    });
  }

  function explode(firework) {
    const shape = shapeMode === 'random' ? random(shapes) : shapeMode;
    const parts = [];

    if (shape === 'smiley') {
      const centerX = firework.x;
      const centerY = firework.y;
      const faceParticles = 60;
      for (let i = 0; i < faceParticles; i++) {
        let angle = (TWO_PI / faceParticles) * i;
        let r = 4;
        parts.push({
          type: 'particle',
          x: centerX + cos(angle) * r,
          y: centerY + sin(angle) * r,
          vx: cos(angle) * 0.04,
          vy: sin(angle) * 0.04,
          life: floor(random(40, 60)),
          ttl: floor(random(40, 60)),
          shape,
          shimmerPhase: 0
        });
      }
      const eyeOffsetY = -2;
      for (let side of [-1.7, 1.7]) {
        parts.push({
          type: 'particle',
          x: centerX + side,
          y: centerY + eyeOffsetY,
          vx: random(-0.01, 0.01),
          vy: random(-0.01, 0.01),
          life: floor(random(40, 60)),
          ttl: floor(random(40, 60)),
          shape,
          shimmerPhase: 0
        });
      }
      const mouthParticles = 20;
      for (let i = 0; i <= mouthParticles; i++) {
        let angle = map(i, 0, mouthParticles, PI / 6, 5 * PI / 6);
        let r = 2.2;
        parts.push({
          type: 'particle',
          x: centerX + cos(angle) * r,
          y: centerY + sin(angle) * r + 0.5,
          vx: cos(angle) * 0.02,
          vy: sin(angle) * 0.02,
          life: floor(random(40, 60)),
          ttl: floor(random(40, 60)),
          shape,
          shimmerPhase: 0
        });
      }
    } else {
      for (let i = 0; i < numParticles; i++) {
        let angle = random(TWO_PI);
        let speed = random(0.5, 1.5);
        let vx = cos(angle) * speed;
        let vy = sin(angle) * speed;

        if (shape === 'ring') vy *= 0.7;
        if (shape === 'star') {
          let starFactor = i % 2 === 0 ? 1.2 : 0.6;
          speed *= starFactor * 0.3;
          vx = cos(angle) * speed;
          vy = sin(angle) * speed;
        }
        if (shape === 'willow') {
          angle = random(Math.PI + QUARTER_PI / 2, TWO_PI - QUARTER_PI / 2);
          speed = random(0.05, 0.3);
          vx = cos(angle) * speed;
          vy = sin(angle) * speed;
        }

        parts.push({
          type: 'particle',
          x: firework.x,
          y: firework.y,
          vx,
          vy,
          life: floor(random(40, 60)),
          ttl: floor(random(40, 60)),
          shape,
          shimmerPhase: random(TWO_PI)
        });
      }
    }

    fireworkswg.push(...parts);
  }

  window.drawFrame = function () {
    background(255);
    fill(0);
    noStroke();

    if (fireworkCooldown-- <= 0) {
      createFirework();
      fireworkCooldown = floor(random(cooldownMin, cooldownMax));
    }

    for (let fw of fireworkswg) {
      if (fw.type === 'rocket') {
        fw.trail.push({ x: fw.x, y: fw.y });
        if (fw.trail.length > 5) fw.trail.shift();
        for (let t of fw.trail) {
          ellipse(t.x * dotSize, t.y * dotSize, dotSize * 0.5 * dotSizeMultiplier);
        }
        ellipse(fw.x * dotSize, fw.y * dotSize, dotSize * 0.8 * dotSizeMultiplier);
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += gravity * 0.5;
        if (!fw.exploded && fw.vy >= 0) {
          fw.exploded = true;
          explode(fw);
        }
      } else if (fw.type === 'particle') {
        let visible = true;
        if (fw.shape === 'willow') {
          const shimmer = sin(frameCount * 0.3 + fw.shimmerPhase);
          visible = shimmer > 0.2 || random() < 0.2;
        }
        if (visible) {
          ellipse(fw.x * dotSize, fw.y * dotSize, dotSize * 0.6 * dotSizeMultiplier);
        }
        fw.x += fw.vx;
        fw.y += fw.vy;
        let gravityMultiplier = 1;
        if (fw.shape === 'willow') gravityMultiplier = 0.08;
        else if (fw.shape === 'smiley') gravityMultiplier = 0.4;
        fw.vy += gravity * gravityMultiplier;
        fw.life--;
      }
    }

    fireworkswg = fireworkswg.filter(fw =>
      (fw.type === 'rocket' && !fw.exploded) ||
      (fw.type === 'particle' && fw.life > 0)
    );
  };

  window.getControls = function () {
    return [
      {
        type: 'range',
        label: 'Gravity',
        min: 0.001,
        max: 0.1,
        step: 0.001,
        value: gravity,
        onInput: val => gravity = val
      },
      {
        type: 'range',
        label: 'Cooldown Min',
        min: 1,
        max: 100,
        step: 1,
        value: cooldownMin,
        onInput: val => cooldownMin = val
      },
      {
        type: 'range',
        label: 'Cooldown Max',
        min: 1,
        max: 100,
        step: 1,
        value: cooldownMax,
        onInput: val => cooldownMax = val
      },
      {
        type: 'range',
        label: 'Dot Size Multiplier',
        min: 0.2,
        max: 3.0,
        step: 0.3,
        value: dotSizeMultiplier,
        onInput: val => dotSizeMultiplier = val
      },
      {
        type: 'range',
        label: 'Particle Count',
        min: 4,
        max: 100,
        step: 1,
        value: numParticles,
        onInput: val => numParticles = val
      },
      {
        type: 'select',
        label: 'Shape Mode',
        options: [
          { label: 'Random', value: 'random' },
          ...shapes.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))
        ],
        value: shapeMode,
        onChange: val => shapeMode = val
      },
      {
        type: 'range',
        label: 'Frame Rate',
        min: 1,
        max: 60,
        step: 1,
        value: currentFrameRate,
        onInput: val => {
          currentFrameRate = val;
          frameRate(val); // dynamically apply it
        }
      }
      
    ];
  };
})();
