// === js/anims/mouse_ripple.js ===
(() => {
  console.log('[Anim] mouse_ripple.js loaded');

  let rippleBursts = [];

  // === CONFIGURABLE PARAMETERS ===
  let ringSpeed = 2.5;
  let ringThickness = 12;
  let ringLifetime = 100;
  let rippleDotSize = 0.8;
  let smoothRipples = false;

  function drawFrame() {
    background(255); // white = OFF
    fill(0);         // black = ON
    noStroke();

    const t = frameCount;

    // Add new ripple on hold
    if (
      mouseIsPressed &&
      mouseX >= 0 && mouseY >= 0 &&
      mouseX < width && mouseY < height
    ) {
      if (t % 5 === 0) {
        rippleBursts.push({
          x: mouseX,
          y: mouseY,
          birth: t
        });
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let cx = x * dotSize + dotSize / 2;
        let cy = y * dotSize + dotSize / 2;

        let isActive = false;

        for (let ripple of rippleBursts) {
          let dx = cx - ripple.x;
          let dy = cy - ripple.y;
          let distToCenter = Math.sqrt(dx * dx + dy * dy);
          let age = t - ripple.birth;
          let radius = age * ringSpeed;

          if (smoothRipples) {
            if (Math.abs(distToCenter - radius) < ringThickness / 2) {
              isActive = true;
              break;
            }
          } else {
            let wave = sin(distToCenter * 0.2 - t * 0.5);
            if (Math.abs(distToCenter - radius) < ringThickness / 2 && wave > 0.3) {
              isActive = true;
              break;
            }
          }
        }

        if (isActive) {
          ellipse(cx, cy, dotSize * rippleDotSize);
        }
      }
    }

    // Remove old ripples
    rippleBursts = rippleBursts.filter(r => t - r.birth < ringLifetime);
  }

  function getControls() {
    return [
      {
        type: 'range',
        label: 'Ripple Speed',
        min: 0.5,
        max: 5,
        step: 0.1,
        value: ringSpeed,
        onInput: val => ringSpeed = val
      },
      {
        type: 'range',
        label: 'Ring Thickness',
        min: 1,
        max: 30,
        step: 1,
        value: ringThickness,
        onInput: val => ringThickness = val
      },
      {
        type: 'range',
        label: 'Ring Lifetime',
        min: 20,
        max: 200,
        step: 5,
        value: ringLifetime,
        onInput: val => ringLifetime = val
      },
      {
        type: 'range',
        label: 'Dot Size',
        min: 0.1,
        max: 1.5,
        step: 0.05,
        value: rippleDotSize,
        onInput: val => rippleDotSize = val
      },
      {
        type: 'checkbox',
        label: 'Smooth Ripples',
        checked: smoothRipples,
        onChange: val => smoothRipples = val
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
