// === js/anims/adjustable_dots.js ===
(() => {
  let dotCount = 25;
  let dotRadius = 4;

  window.drawFrame = function () {
    background(255);
    fill(0);
    noStroke();

    const dotSpacing = width / (dotCount + 1);

    for (let i = 1; i <= dotCount; i++) {
      ellipse(i * dotSpacing, height / 2, dotRadius * 2);
    }
  };

  window.getControls = function () {
    return [
      {
        label: 'Dot Count',
        type: 'range',
        min: 1,
        max: 100,
        value: dotCount,
        step: 1,
        onInput: val => dotCount = val
      },
      {
        label: 'Dot Size',
        type: 'range',
        min: 1,
        max: 10,
        value: dotRadius,
        step: 1,
        onInput: val => dotRadius = val
      }
    ];
  };
})();
