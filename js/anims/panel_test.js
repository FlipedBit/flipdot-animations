
/*
========================================
🧪 Panel Test Animation (panel_test.js)
========================================

This animation helps confirm correct panel addressing on the flipdot display.
It renders:

  - A **solid white** pattern on the bottom panel
  - A **checkerboard** pattern on the top panel

Use this to verify that:
  ✅ `y < 7` maps to the top panel
  ✅ `y ≥ 7` maps to the bottom panel
  ✅ Bit ordering and addressing logic in flipdot.js is working properly

Recommended during:
  • Hardware setup
  • Troubleshooting bit mapping
  • Verifying split-panel rendering behavior

*/



console.log('[Anim] panel_test.js loaded');

function drawFrame() {
  background(255);
  fill(0);
  noStroke();

  for (let y = 0; y < rows; y++) {
    const isTop = y < rows / 2;

    for (let x = 0; x < cols; x++) {
      if (isTop) {
        // Top panel: checkerboard
        if ((x + y) % 2 === 0) {
          ellipse(
            x * dotSize + dotSize / 2,
            y * dotSize + dotSize / 2,
            dotSize * 0.8
          );
        }
      } else {
        // Bottom panel: solid fill
        ellipse(
          x * dotSize + dotSize / 2,
          y * dotSize + dotSize / 2,
          dotSize * 0.8
        );
      }
    }
  }
}
