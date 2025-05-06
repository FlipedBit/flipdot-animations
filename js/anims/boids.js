// === js/anims/boids.js ===
(() => {
  console.log('[Anim] boids.js loaded');

  let boids = [];

  let numInitialBoids = 5;
  let maxSpeed = 0.3;
  let neighborDist = 4;
  let separationDist = 2;
  let alignStrength = 0.05;
  let cohesionStrength = 0.02;
  let separationStrength = 0.08;

  function setupBoids() {
    boids = [];
    for (let i = 0; i < numInitialBoids; i++) {
      boids.push({
        x: random(cols),
        y: random(rows),
        vx: random(-maxSpeed, maxSpeed),
        vy: random(-maxSpeed, maxSpeed)
      });
    }
  }

  window.drawFrame = function () {
    if (boids.length === 0) setupBoids();

    background(255);
    fill(0);
    noStroke();

    for (let b of boids) {
      let avgVX = 0, avgVY = 0, centerX = 0, centerY = 0;
      let separateX = 0, separateY = 0;
      let count = 0, separateCount = 0;

      for (let other of boids) {
        if (other === b) continue;
        let dx = other.x - b.x;
        let dy = other.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < neighborDist) {
          avgVX += other.vx;
          avgVY += other.vy;
          centerX += other.x;
          centerY += other.y;
          count++;
        }
        if (dist < separationDist) {
          separateX -= dx;
          separateY -= dy;
          separateCount++;
        }
      }

      if (count > 0) {
        avgVX /= count;
        avgVY /= count;
        b.vx += (avgVX - b.vx) * alignStrength;
        b.vy += (avgVY - b.vy) * alignStrength;

        centerX /= count;
        centerY /= count;
        b.vx += (centerX - b.x) * cohesionStrength;
        b.vy += (centerY - b.y) * cohesionStrength;
      }

      if (separateCount > 0) {
        b.vx += separateX * separationStrength;
        b.vy += separateY * separationStrength;
      }

      let speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > maxSpeed) {
        b.vx = (b.vx / speed) * maxSpeed;
        b.vy = (b.vy / speed) * maxSpeed;
      }

      b.x += b.vx;
      b.y += b.vy;

      if (b.x < 0) b.x += cols;
      if (b.x >= cols) b.x -= cols;
      if (b.y < 0) b.y += rows;
      if (b.y >= rows) b.y -= rows;

      const gx = Math.round(b.x);
      const gy = Math.round(b.y);
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
        ellipse(gx * dotSize + dotSize / 2, gy * dotSize + dotSize / 2, dotSize * 0.9);
      }
    }

    const displayEl = document.getElementById('boidCountDisplay');
    if (displayEl) displayEl.textContent = boids.length;
  };

  window.mousePressed = function () {
    boids.push({
      x: mouseX / dotSize,
      y: mouseY / dotSize,
      vx: random(-maxSpeed, maxSpeed),
      vy: random(-maxSpeed, maxSpeed)
    });
  };

  window.getControls = function () {
    return [
      {
        type: 'range',
        label: 'Max Speed',
        min: 0.01,
        max: 1,
        step: 0.01,
        value: maxSpeed,
        onInput: val => maxSpeed = val
      },
      {
        type: 'range',
        label: 'Neighbor Distance',
        min: 1,
        max: 10,
        step: 0.1,
        value: neighborDist,
        onInput: val => neighborDist = val
      },
      {
        type: 'range',
        label: 'Separation Distance',
        min: 0.5,
        max: 5,
        step: 0.1,
        value: separationDist,
        onInput: val => separationDist = val
      },
      {
        type: 'range',
        label: 'Alignment Strength',
        min: 0,
        max: 0.2,
        step: 0.01,
        value: alignStrength,
        onInput: val => alignStrength = val
      },
      {
        type: 'range',
        label: 'Cohesion Strength',
        min: 0,
        max: 0.2,
        step: 0.01,
        value: cohesionStrength,
        onInput: val => cohesionStrength = val
      },
      {
        type: 'range',
        label: 'Separation Strength',
        min: 0,
        max: 0.5,
        step: 0.01,
        value: separationStrength,
        onInput: val => separationStrength = val
      },
      {
        type: 'button',
        label: 'Reset Boids',
        onClick: setupBoids
      },
      {
        type: 'display',
        label: 'Boid Count: ',
        varName: 'boidCountDisplay'
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
