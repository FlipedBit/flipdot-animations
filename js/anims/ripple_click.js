
// Ripple click: triggers wave animation from mouse position

//note: declaring these variables here in this way, allows them to persist across multiple animation loads
  // its the same as declaring like "let rippleOrigin = null;"" and "let rippleStart = 0;"" 
  //we have to declare them in this IF block below to avoid redeclaring them every time we load this animation
  // this way we can safely load this animation 1 thousand times without breaking the ripple effect by attempting to redeclare things that are already declared globally.
// === js/anims/ripple_click.js ===
// === js/anims/ripple_click.js ===
// === js/anims/ripple_click.js ===
// === js/anims/ripple_click.js ===
(() => {
  console.log('[Anim] ripple_click.js loaded');

  let rippleOrigin = null;
  let rippleStart = 0;

  // === CONFIGURABLE PARAMETERS ===
  let rippleSpeed = 2;     // How fast the ripple expands
  let waveSpacing = 0.2;   // Wavelength multiplier
  let rippleWidth = 6;     // Thickness of the visible ripple ring
  let waveThreshold = 0.3; // Minimum wave height to display
  let rippleDotSize = 0.9; // Size of dots used in ripple (relative to dotSize)
  let smoothRipples = false; // Toggle between rhythmic and smooth ripples

  function drawFrame() {
    background(255);
    fill(0);
    noStroke();

    if (rippleOrigin) {
      let t = (frameCount - rippleStart) * rippleSpeed;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let cx = x * dotSize + dotSize / 2;
          let cy = y * dotSize + dotSize / 2;
          let d = dist(cx, cy, rippleOrigin.x, rippleOrigin.y);

          if (smoothRipples) {
            if (abs(d - t) < rippleWidth) {
              ellipse(cx, cy, dotSize * rippleDotSize);
            }
          } else {
            let wave = sin(d * waveSpacing - t * 0.5);
            if (abs(d - t) < rippleWidth && wave > waveThreshold) {
              ellipse(cx, cy, dotSize * rippleDotSize);
            }
          }
        }
      }
    }
  }

  function mousePressed() {
    rippleOrigin = { x: mouseX, y: mouseY };
    rippleStart = frameCount;
  }

  function getControls() {
    return [
      {
        type: 'range',
        label: 'Ripple Speed',
        min: 0.5,
        max: 5,
        step: 0.1,
        value: rippleSpeed,
        onInput: val => rippleSpeed = val
      },
      {
        type: 'range',
        label: 'Wave Spacing',
        min: 0.05,
        max: 1.0,
        step: 0.01,
        value: waveSpacing,
        onInput: val => waveSpacing = val
      },
      {
        type: 'range',
        label: 'Ripple Width',
        min: 1,
        max: 20,
        step: 1,
        value: rippleWidth,
        onInput: val => rippleWidth = val
      },
      {
        type: 'range',
        label: 'Wave Threshold',
        min: 0,
        max: 1,
        step: 0.01,
        value: waveThreshold,
        onInput: val => waveThreshold = val
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
  window.mousePressed = mousePressed;
  window.getControls = getControls;
})();
