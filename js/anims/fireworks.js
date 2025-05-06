// === js/anims/fireworks.js ===
(() => {
  console.log('[Anim] fireworks.js loaded');

  let fireworks = [];
  let launchChance = 0.03;
  let gravity = 0.01;
  let dotSizeMultiplier = 1;
  let minParticles = 8;
  let maxParticles = 16;

  function setupFireworks() {
    fireworks = [];
  }

  function createFirework() {
    fireworks.push({
      state: 'ascend',
      x: floor(random(cols)),
      y: rows,
      speedY: random(0.2, 0.4),
      burstAt: floor(random(4, 8)),
      particles: [],
      life: 0
    });
  }

  window.drawFrame = function () {
    background(255);
    fill(0);
    noStroke();

    if (random() < launchChance) {
      createFirework();
    }

    for (let fw of fireworks) {
      if (fw.state === 'ascend') {
        fw.y -= fw.speedY;
        ellipse(fw.x * dotSize + dotSize / 2, fw.y * dotSize, dotSize * 0.8 * dotSizeMultiplier);

        if (fw.y <= fw.burstAt) {
          fw.state = 'burst';

          const count = floor(random(minParticles, maxParticles));
          for (let i = 0; i < count; i++) {
            const angle = (TWO_PI / count) * i;
            fw.particles.push({
              x: fw.x,
              y: fw.y,
              dx: cos(angle) * random(0.1, 0.3),
              dy: sin(angle) * random(0.1, 0.3),
              ttl: floor(random(10, 20))
            });
          }
        }
      } else if (fw.state === 'burst') {
        fw.life++;
        for (let p of fw.particles) {
          if (p.ttl > 0) {
            p.x += p.dx;
            p.y += p.dy;
            p.dy += gravity;
            p.ttl--;
            ellipse(p.x * dotSize + dotSize / 2, p.y * dotSize + dotSize / 2, dotSize * 0.6 * dotSizeMultiplier);
          }
        }
      }
    }

    fireworks = fireworks.filter(fw =>
      fw.state === 'ascend' || fw.particles.some(p => p.ttl > 0)
    );
  };

  window.getControls = function () {
    return [
      {
        type: 'range',
        label: 'Launch Probability',
        min: 0.001,
        max: 0.2,
        step: 0.001,
        value: launchChance,
        onInput: val => launchChance = val
      },
      {
        type: 'range',
        label: 'Gravity',
        min: 0.001,
        max: 0.05,
        step: 0.001,
        value: gravity,
        onInput: val => gravity = val
      },
      {
        type: 'range',
        label: 'Dot Size Multiplier',
        min: 0.2,
        max: 2.0,
        step: 0.1,
        value: dotSizeMultiplier,
        onInput: val => dotSizeMultiplier = val
      },
      {
        type: 'range',
        label: 'Min Particles',
        min: 4,
        max: 30,
        step: 1,
        value: minParticles,
        onInput: val => minParticles = val
      },
      {
        type: 'range',
        label: 'Max Particles',
        min: 5,
        max: 50,
        step: 1,
        value: maxParticles,
        onInput: val => maxParticles = val
      },
      {
        type: 'button',
        label: 'Reset Fireworks',
        onClick: () => setupFireworks()
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
