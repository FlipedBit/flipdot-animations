// === js/anims/fly_swatter.js ===
(() => {
  console.log('[Anim] fly_swatter.js loaded');

  // === CONFIGURABLE VARIABLES ===
  let flies = [];
  let flySpeed = 0.15;
  let maxFlies = 6;
  let swatterWidth = 3;
  let swatterHeight = 4;
  let splats = [];
  let splatSize = 3; // Multiplier for splat radius

  function setupFlies() {
    flies = [];
    for (let i = 0; i < maxFlies; i++) {
      let dx = random([-1, 1]) + random(-0.1, 0.1);
      let dy = random([-1, 1]) + random(-0.1, 0.1);
      flies.push({
        x: random(cols),
        y: random(rows),
        dx,
        dy
      });
    }
  }

  function drawFrame() {
    if (flies.length === 0) setupFlies();

    background(255);
    fill(0);
    noStroke();

    // === Draw splats ===
    for (let splat of splats) {
      ellipse(
        splat.x * dotSize + dotSize / 2,
        splat.y * dotSize + dotSize / 2,
        dotSize * splatSize
      );
    }

    // === Draw and move flies ===
    for (let fly of flies) {
      ellipse(
        fly.x * dotSize + dotSize / 2,
        fly.y * dotSize + dotSize / 2,
        dotSize * 2
      );

      fly.x += fly.dx * flySpeed;
      fly.y += fly.dy * flySpeed;

      if (fly.x < 0 || fly.x > cols - 1) fly.dx *= -1;
      if (fly.y < 0 || fly.y > rows - 1) fly.dy *= -1;

      fly.x = constrain(fly.x, 0, cols - 1);
      fly.y = constrain(fly.y, 0, rows - 1);

      if (random() < 0.01) {
        fly.dx += random(-0.2, 0.2);
        fly.dy += random(-0.2, 0.2);
        const mag = Math.sqrt(fly.dx * fly.dx + fly.dy * fly.dy);
        if (mag > 0) {
          fly.dx /= mag;
          fly.dy /= mag;
        }
      }
    }

    // === Draw swatter ===
    if (
      mouseX >= 0 && mouseY >= 0 &&
      mouseX < width && mouseY < height
    ) {
      let gx = Math.floor(mouseX / dotSize);
      let gy = Math.floor(mouseY / dotSize);

      for (let dx = 0; dx < swatterWidth; dx++) {
        for (let dy = 0; dy < swatterHeight; dy++) {
          let px = (gx + dx) * dotSize + dotSize / 2;
          let py = (gy + dy) * dotSize + dotSize / 2;

          if (gx + dx < cols && gy + dy < rows) {
            ellipse(px, py, dotSize * 0.9);
          }
        }
      }

      // === Draw wand handle ===
      stroke(0);
      strokeWeight(2);
      line(
        (gx + swatterWidth / 2) * dotSize,
        (gy + swatterHeight) * dotSize,
        (gx + swatterWidth / 2) * dotSize,
        (gy + swatterHeight + 3) * dotSize
      );
      noStroke();
    }
  }

  function mousePressed() {
    let gx = Math.floor(mouseX / dotSize);
    let gy = Math.floor(mouseY / dotSize);

    flies = flies.filter(fly => {
      let hit = (
        fly.x >= gx && fly.x <= gx + swatterWidth - 1 &&
        fly.y >= gy && fly.y <= gy + swatterHeight - 1
      );
      if (hit) {
        splats.push({ x: fly.x, y: fly.y });
      }
      return !hit;
    });
  }

  function getControls() {
    return [
      {
        type: 'range',
        label: 'Fly Speed',
        min: 0.01,
        max: 1,
        step: 0.01,
        value: flySpeed,
        onInput: val => flySpeed = val
      },
      {
        type: 'range',
        label: 'Max Flies',
        min: 1,
        max: 20,
        step: 1,
        value: maxFlies,
        onInput: val => {
          maxFlies = val;
          setupFlies();
        }
      },
      {
        type: 'range',
        label: 'Swatter Width',
        min: 1,
        max: 6,
        step: 1,
        value: swatterWidth,
        onInput: val => swatterWidth = val
      },
      {
        type: 'range',
        label: 'Swatter Height',
        min: 1,
        max: 6,
        step: 1,
        value: swatterHeight,
        onInput: val => swatterHeight = val
      },
      {
        type: 'range',
        label: 'Splat Size',
        min: 0.5,
        max: 3,
        step: 0.1,
        value: splatSize,
        onInput: val => splatSize = val
      },
      {
        type: 'button',
        label: 'Reset Flies',
        onClick: () => {
          setupFlies();
          splats = [];
        }
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
  }

  window.drawFrame = drawFrame;
  window.mousePressed = mousePressed;
  window.getControls = getControls;
})();
