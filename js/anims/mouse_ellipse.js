
console.log('[Anim] mouse_ellipse.js loaded');

// This sketch draws an ellipse that follows the mouse position.
function drawFrame() {
  background(220);
  fill('black');
  stroke('black');
  ellipse(mouseX, mouseY, mouseX);  // Size tied to X

  // Note: no need for canvas2display(); handled by sketch.js
}
