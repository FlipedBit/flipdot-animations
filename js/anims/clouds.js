// === js/anims/clouds.js ===
(() => {
    console.log('[Anim] clouds.js loaded');
  
    let noiseScale = 0.05;
    let speedX = 0.01;
    let speedY = 0.002;
    let speedZ = 0.003;
    let threshold = 0.4;
    let cloudType = 'puff';
    let zOff = 0;
    let colorInverted = false;
  
    function drawFrame() {
      if (colorInverted) {
        background(0);  // black bg
        fill(255);      // white clouds
      } else {
        background(255); // white bg
        fill(0);         // black clouds
      }
  
      noStroke();
  
      zOff += speedZ;
  
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          let nx = x * noiseScale + frameCount * speedX;
          let ny = y * noiseScale + frameCount * speedY;
          let nz = zOff;
  
          let n = noise(nx, ny, nz);
  
          if (cloudType === 'streak') {
            n = pow(n, 1.5);
          } else if (cloudType === 'storm') {
            n = sin(n * PI * 2);
          }
  
          if (n > threshold) {
            ellipse(x * dotSize + dotSize / 2, y * dotSize + dotSize / 2, dotSize * 0.9);
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
          max: 0.2,
          step: 0.005,
          value: noiseScale,
          onInput: val => noiseScale = val
        },
        {
          type: 'range',
          label: 'Speed X',
          min: -0.05,
          max: 0.05,
          step: 0.001,
          value: speedX,
          onInput: val => speedX = val
        },
        {
          type: 'range',
          label: 'Speed Y',
          min: -0.05,
          max: 0.05,
          step: 0.001,
          value: speedY,
          onInput: val => speedY = val
        },
        {
          type: 'range',
          label: 'Speed Z',
          min: 0,
          max: 0.05,
          step: 0.001,
          value: speedZ,
          onInput: val => speedZ = val
        },
        {
          type: 'range',
          label: 'Threshold',
          min: 0,
          max: 1,
          step: 0.01,
          value: threshold,
          onInput: val => threshold = val
        },
        {
          type: 'select',
          label: 'Cloud Type',
          options: [
            { label: 'Puff', value: 'puff' },
            { label: 'Streak', value: 'streak' },
            { label: 'Storm', value: 'storm' }
          ],
          value: cloudType,
          onChange: val => cloudType = val
        },
        {
          type: 'checkbox',
          label: 'Invert Colors',
          checked: colorInverted,
          onChange: val => colorInverted = val
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
  