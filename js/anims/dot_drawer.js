

// Dot drawer: left-click to draw, right-click to erase, double-click to clear

/* normally we would decalre these top 3 varianbles simply, just like this:
let trail = {};
let lastClickTime = 0;
let clickTimeout = 300;
but we cant do that here because this script can be loaded multiple times via the load button
and if we try to declare them like that, it will throw an error
because they are already defined in the global scope.
So we need to ensure these variables are only defined once, and persist across loads
we can do this by using IF blocks, thus checking if they are already defined in the global scope
if they are not defined, we define them here */
// === js/anims/dot_drawer.js ===
(() => {
  console.log('[Anim] dot_drawer.js loaded');

  // Internal persistent state
  let trail = {};
  let lastClickTime = 0;
  const clickTimeout = 300;

  window.drawFrame = function () {
    background(255);
    noStroke();
    for (let key in trail) {
      let [gx, gy] = key.split(',').map(Number);
      let cx = gx * dotSize + dotSize / 2;
      let cy = gy * dotSize + dotSize / 2;
      fill(trail[key]);
      ellipse(cx, cy, dotSize * 0.9);
    }
  };

  window.mousePressed = function () {
    let gx = Math.floor(mouseX / dotSize);
    let gy = Math.floor(mouseY / dotSize);
    let key = `${gx},${gy}`;

    if (mouseButton === RIGHT) {
      trail[key] = 255;
      return false;
    }

    const now = millis();
    if (mouseButton === LEFT && now - lastClickTime < clickTimeout) {
      trail = {};
    }
    lastClickTime = now;
  };

  window.mouseDragged = function () {
    let gx = Math.floor(mouseX / dotSize);
    let gy = Math.floor(mouseY / dotSize);

    if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
      let key = `${gx},${gy}`;
      if (mouseButton === LEFT) {
        trail[key] = 0;
      } else if (mouseButton === RIGHT) {
        trail[key] = 255;
      }
    }
  };

  window.getControls = function () {
    return [
      {
        type: 'button',
        label: 'Clear Dots',
        onClick: () => {
          trail = {};
        }
      }
    ];
  };
})();


