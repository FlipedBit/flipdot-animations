// === js/anims/wave.js ===
(() => {
  console.log('[Anim] wave.js loaded');

  // === CONFIGURABLE PARAMETERS ===
  let waveSpeed = 0.05;
  let waveHeight = rows / 3;
  let waveFrequency = 0.5;
  let dotScale = 1;
  let interactiveMode = true;

  let mouseInfluence = 2.0;
  let mouseRadius = 5;
  let waveDensity = cols; // default: one dot per column

  let lastClickFrame = -100;
  let pulseDuration = 5;

  function drawFrame() {
    background(255);
    fill(0);
    noStroke();

    let step = Math.max(1, cols / waveDensity);
    let boosted = frameCount - lastClickFrame < pulseDuration;
    let currentHeight = boosted ? waveHeight * 1.5 : waveHeight;
    
    for (let x = 0; x < cols; x += step) {
      let baseY = rows / 2;
      let waveY = baseY + sin((x * waveFrequency) + frameCount * waveSpeed) * currentHeight;


      // Apply interactive influence if enabled
      if (interactiveMode && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        let gx = Math.floor(mouseX / dotSize);
        let dx = Math.abs(gx - x);
        if (dx < mouseRadius) {
          let strength = (mouseRadius - dx) / mouseRadius;
          waveY += sin(frameCount * 0.4) * waveHeight * strength * mouseInfluence;
        }
      }

      ellipse(x * dotSize + dotSize / 2, waveY * dotSize + dotSize / 2, dotSize * dotScale);
    }
  }

  function getControls() {
    return [
      {
        type: 'range',
        label: 'Wave Speed',
        min: 0.01,
        max: .5,
        step: 0.01,
        value: waveSpeed,
        onInput: val => waveSpeed = val
      },
      {
        type: 'range',
        label: 'Wave Height',
        min: 1,
        max: rows / 2,
        step: 1,
        value: waveHeight,
        onInput: val => waveHeight = val
      },
      {
        type: 'range',
        label: 'Wave Frequency',
        min: 0.1,
        max: 3.0,
        step: 0.1,
        value: waveFrequency,
        onInput: val => waveFrequency = val
      },
      {
        type: 'range',
        label: 'Dot Size',
        min: 0.1,
        max: 1.5,
        step: 0.05,
        value: dotScale,
        onInput: val => dotScale = val
      },
      {
        type: 'checkbox',
        label: 'Interactive Mode',
        checked: interactiveMode,
        onChange: val => interactiveMode = val
      },
      {
        type: 'range',
        label: 'Mouse Influence',
        min: 0,
        max: 5,
        step: 0.1,
        value: mouseInfluence,
        onInput: val => mouseInfluence = val
      },
      {
        type: 'range',
        label: 'Mouse Radius',
        min: 1,
        max: 10,
        step: 1,
        value: mouseRadius,
        onInput: val => mouseRadius = val
      },
      {
        type: 'range',
        label: 'Wave Density',
        min: 2,
        max: cols,
        step: 1,
        value: waveDensity,
        onInput: val => waveDensity = val
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
 
  window.mousePressed = () => {
    if (mouseButton === LEFT) {
      lastClickFrame = frameCount;
    } else if (mouseButton === RIGHT) {
      waveSpeed *= -1;
      return false; // prevent context menu
    }
  };
  window.drawFrame = drawFrame;
  window.getControls = getControls;
})();
