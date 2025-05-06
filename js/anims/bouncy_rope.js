// === js/anims/bouncy_rope.js ===
(() => {
  console.log('[Anim] bouncy_rope.js loaded');

  let ballY = 0;
  let ballVY = 0;
  let gravity = 0.2;
  let bounceDamping = 0.98;

  let ballX = Math.floor(cols / 2);
  let ballSize = 2;
  let ballWeight = 3;
  let ballVX = 0.5;
  let ropeElasticity = 0.2;

  let rope = new Array(cols).fill(rows / 2);

  function resetBall() {
    ballX = Math.floor(cols / 2);
    ballY = 0;
    ballVY = 0;
    ballVX = 0.5;
  }

  window.drawFrame = function () {
    background(255);

    // === Update Ball Physics ===
    ballVY += gravity;
    ballY += ballVY;
    ballX += ballVX;

    if (ballX - ballSize < 0) {
      ballX = ballSize;
      ballVX *= -1;
    } else if (ballX + ballSize >= cols) {
      ballX = cols - ballSize - 1;
      ballVX *= -1;
    }

    const groundY = rope[ballX];

    const ballBottom = ballY + ballSize;
    if (ballBottom >= groundY) {
      ballY = groundY - ballSize;
      const elasticityBoost = ropeElasticity * 5;
      ballVY = -Math.max(Math.abs(ballVY) * bounceDamping, elasticityBoost);

      for (let i = 0; i < rope.length; i++) {
        const dist = Math.abs(i - ballX);
        const influence = Math.max(0, ballWeight - dist);
        rope[i] += influence;
      }
    }

    for (let i = 0; i < rope.length; i++) {
      rope[i] += (rows / 2 - rope[i]) * ropeElasticity;
    }

    fill(0);
    noStroke();

    for (let i = 0; i < rope.length; i++) {
      const ropeY = Math.round(rope[i]);
      const px = i * dotSize;
      const py = ropeY * dotSize;

      rect(px, py, dotSize, dotSize);
      rect(px, py + dotSize, dotSize, dotSize); // thicker
    }

    const ballPixelY = (ballY + ballSize) * dotSize;
    ellipse(ballX * dotSize + dotSize / 2, ballPixelY, ballSize * dotSize);
  };

  window.getControls = function () {
    return [
      {
        type: 'range',
        label: 'Ball Size',
        min: 1,
        max: 5,
        step: 1,
        value: ballSize,
        onInput: val => (ballSize = val)
      },
      {
        type: 'range',
        label: 'Ball Weight',
        min: 1,
        max: 10,
        step: 1,
        value: ballWeight,
        onInput: val => (ballWeight = val)
      },
      {
        type: 'range',
        label: 'Gravity',
        min: 0.1,
        max: 1,
        step: 0.01,
        value: gravity,
        onInput: val => (gravity = val)
      },
      {
        type: 'range',
        label: 'Bounce Damping',
        min: 0.5,
        max: 1.0,
        step: 0.01,
        value: bounceDamping,
        onInput: val => (bounceDamping = val)
      },
      {
        type: 'range',
        label: 'Rope Elasticity',
        min: 0.01,
        max: 0.5,
        step: 0.01,
        value: ropeElasticity,
        onInput: val => (ropeElasticity = val)
      },
      {
        type: 'button',
        label: 'Reset Ball',
        onClick: resetBall
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
