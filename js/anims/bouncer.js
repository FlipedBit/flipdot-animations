
// Bouncer animation: a single dot sweeps across the screen
console.log('[Anim] bouncer.js loaded');

function drawFrame() {
  fill(0);
  noStroke();
  let r = frameCount % cols;
  ellipse(r * dotSize + dotSize / 2, height / 2, dotSize * 0.9);
}
