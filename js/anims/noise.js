// === js/anims/noise.js ===
(() => {
  console.log('[Anim] noise.js loaded');

  // === CONFIGURABLE PARAMETERS ===
  let noiseScale = 0.05;
  let noiseThreshold = 0.5;
  let repelRadius = 100;
  let repelAmount = 0.5;

  function drawFrame() {
    background(255);
    fill(0);
    noStroke();

    const t = frameCount * 0.006;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let cx = x * dotSize + dotSize / 2;
        let cy = y * dotSize + dotSize / 2;

        let nx = x * noiseScale;
        let ny = y * noiseScale;

        let dx = cx - mouseX;
        let dy = cy - mouseY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repelRadius) {
          let strength = (1 - dist / repelRadius) * repelAmount;
          nx += dx * strength * noiseScale;
          ny += dy * strength * noiseScale;
        }

        let n = noise(nx, ny, t);
        if (n > noiseThreshold) {
          ellipse(cx, cy, dotSize * 0.7);
        }
      }
    }
  }

  function getControls() {
    return [
      {
        type: 'range',
        label: 'Noise Scale',
        min: 0.01,
        max: 0.3,
        step: 0.005,
        value: noiseScale,
        onInput: val => noiseScale = val
      },
      {
        type: 'range',
        label: 'Threshold',
        min: 0,
        max: 1,
        step: 0.01,
        value: noiseThreshold,
        onInput: val => noiseThreshold = val
      },
      {
        type: 'range',
        label: 'Repel Radius',
        min: 0,
        max: 200,
        step: 1,
        value: repelRadius,
        onInput: val => repelRadius = val
      },
      {
        type: 'range',
        label: 'Repel Amount',
        min: 0,
        max: 2,
        step: 0.05,
        value: repelAmount,
        onInput: val => repelAmount = val
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
  window.getControls = getControls;
})();
