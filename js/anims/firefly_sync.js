
//#region how firefly_sync_animation works
/*
===========================================
🔥 Firefly Sync Animation – System Overview
===========================================

This animation simulates a swarm of blinking fireflies that gradually
synchronize using a triangle wave and optional local influence. Fireflies fade
in and out, pulsing as a collective — with their population modulated by a
cyclical wave and local proximity sync.

----------------------------------------
🔢 GLOBAL CONFIGURATION VARIABLES
----------------------------------------

(These are declared with `if (typeof ... === 'undefined')` to persist across reloads.)

• `fireflies` (2D array of firefly objects)
    - Stores firefly state for each coordinate in the display grid.
    - Each cell corresponds to a grid position (x, y).
    - Example: `fireflies[10][15]` for row (y) '10 and column (x) '15'.
    - Each cell contains an object with properties:
    - Each firefly has these properties: `active`, `timer`, `threshold`, `flashing`, `flashTimer`.

• `activeCount` (int)
    - Number of currently active fireflies.

• `flashDuration` (int, frames)
    - How long each firefly remains visible ("on") after flashing.
    - 🔽 Lower = quicker firefly flash
    - 🔼 Higher = longer persistence on screen
    - a good value for this is around 4 to 6 frames

• `cyclePhase` (float, radians)
    - Represents the current position in the triangle wave cycle.
    - The current time position in the triangle wave cycle.
    - Advances by `cycleSpeed` every frame. so a higher cyleSpeed means the cyclePhase will move faster.

• `cycleSpeed` (float)
    - How fast `cyclePhase` progresses.
    - 🔽 Lower = slower, ambient pulsing
    - 🔼 Higher = faster, rhythmic flickering

• `minFireflies`, `maxFireflies` (int)
    - Minimum and maximum firefly population at the low and high points
      of the cycle.
    - Used to calculate `cycleTarget`.  
    - If `cycleTarget` is less than `minFireflies`, then the fireflies will not blink, and if it is greater than `maxFireflies`, then the fireflies will blink.
    - 🔽 Lower `minFireflies` (compared to maxFireflies) = more dramatic fade-out

• `cycleTarget` (int, dynamic)
    - Target number of fireflies based on triangle wave value.
    - Automatically updated each frame from:  
      `triangleWave(cyclePhase) → mapped to [minFireflies, maxFireflies]`

----------------------------------------
🧠 LOCAL SYNCING PARAMETERS (These simulate the behavior of fireflies syncing with each other when they see nearby flashes:)
----------------------------------------

These add inter-firefly influence and complexity to blinking behavior:
    syncRadius: how far a firefly "sees" others flashing nearby
    influence: how much each nearby flashing firefly speeds up the countdown
    baseThreshold: how long a firefly waits before flashing, unless influenced

  If you disable or zero-out syncRadius or influence, fireflies will still flash, but:
    There will be less emergent synchronization
    The timing will feel more randomized and individual

• `baseThreshold` (number, in frames)
    - Controls how long each active firefly waits before blinking again.
    - Acts as a countdown timer — when it hits zero, the firefly flashes.
    - 🔽 Lower = fireflies blink **more frequently**.
    - 🔼 Higher = fireflies blink **less frequently**, creating a slower rhythm
    - A good value is '120' (4 seconds at 30 FPS).

• `syncRadius` (float)
    - Distance (in grid units) at which nearby fireflies exert influence.
    - e.g., 2.5 = influence spreads to fireflies within 2.5 grid cells.

• `Influence` (float, percent)
    - How much nearby flashing fireflies increase the chance of a firefly activating.
    - e.g., `0.02` adds 2% chance per nearby firefly.

----------------------------------------
🌊 HOW IT WORKS
----------------------------------------

Step 1: The Display Grid
    The screen is divided into a grid of dots, like pixels.
    Each dot can either be off (white) or on (black) to represent a flashing firefly.

Step 2: Every Grid Cell Can Hold One Firefly
    Behind the scenes, each cell has a firefly object that tracks properties:
        active: whether the firefly is alive and participating
        timer: how long it's been waiting to flash
        threshold: how long it must wait before it’s allowed to flash
        flashTimer: how long the firefly has been flashing (on)
        flashing: true if currently lit
Step 3: A Global Pulse Controls Population
    A "cycle phase" value counts up smoothly over time (like a clock hand).
    This phase is used to calculate a triangle wave — a smooth pattern that rises from 0 to 1 and back to 0 again (like a triangle shape).
    That triangle wave controls the target number of active fireflies, like so:
        cycleTarget = triangleWave(cyclePhase) → mapped to minFireflies..maxFireflies
    This means the number of fireflies rises and falls over time.
Step 4: The Code Tries to Match the Target
    If there are fewer fireflies than cycleTarget, the system activates new ones randomly.
    If there are too many, it deactivates some (also randomly).
    This creates a flowing population of flashing dots.
Step 5: Fireflies Wait to Flash
  Each active firefly has a countdown timer:
    It waits for threshold frames (typically 120 = 4 seconds).
    When the timer reaches the threshold, it flashes for flashDuration frames (e.g., 6 = 0.2s).
Step 6: Fireflies Can Sync With Neighbors
  If syncRadius and influence are enabled:
    Each frame, a firefly checks how many nearby fireflies are flashing.
    The more flashing neighbors it sees, the faster its timer counts up.
    This means it will flash sooner, syncing up with the group.
----------------------------------------
💡 Summary of Key Variables
----------------------------------------

Variable	Description
cycleSpeed	How fast the wave rises/falls (smaller = slower animation)
minFireflies / maxFireflies	The population range for the wave
cycleTarget	How many fireflies should be on right now
baseThreshold	How many frames each firefly normally waits before flashing
flashDuration	How many frames a firefly stays lit once triggered
syncRadius	How far a firefly looks to detect flashing neighbors
influence	How much each flashing neighbor speeds up the timer

----------------------------------------
🧪 DEBUG display
----------------------------------------

In the web UI, we use a debug sidebar to display:
- Frame, `cycleTarget`, `activeCount`
- Triangle wave value, `cyclePhase`
- Mini bar charts for visuals

We also log out to console every ~2 secs to track sync state like this:
     if (frameCount % 60 === 0) {
        console.log(`[firefly_sync] Frame: ${frameCount} | Active: ${activeCount} | Target: ${cycleTarget} | Phase: ${cyclePhase.toFixed(2)} | Triangle: ${triangleWave(cyclePhase).toFixed(2)}`);
        }
*/
//#endregion
// === js/anims/firefly_sync.js ===
(() => {
  console.log('[Anim] firefly_sync.js loaded');

  // === STATE ===
  let fireflies = [];
  let baseThreshold = 120;
  let flashDuration = 4;
  let syncRadius = 8;
  let influence = 0.02;
  let activeCount = 0;
  let cycleTarget = 0;
  let cyclePhase = 0;
  let cycleSpeed = 0.004;
  let minFireflies = 3;
  let maxFireflies = rows * cols;
  let showFireflySidebar = false;

  function triangleWave(phase) {
    return 1 - Math.abs(((phase / Math.PI) % 2) - 1);
  }

  function setupFireflies() {
    fireflies = [];
    activeCount = 0;

    for (let y = 0; y < rows; y++) {
      fireflies[y] = [];
      for (let x = 0; x < cols; x++) {
        fireflies[y][x] = {
          active: false,
          timer: 0,
          threshold: baseThreshold,
          flashTimer: 0,
          flashing: false,
        };
      }
    }

    for (let i = 0; i < minFireflies; i++) {
      const rx = floor(random(cols));
      const ry = floor(random(rows));
      let f = fireflies[ry][rx];
      f.active = true;
      f.timer = floor(random(baseThreshold));
      activeCount++;
    }
  }

  window.drawFrame = function () {
    if (fireflies.length === 0) setupFireflies();

    background(255);
    fill(0);
    noStroke();

    cyclePhase += cycleSpeed;
    cycleTarget = floor(map(triangleWave(cyclePhase), 0, 1, minFireflies, maxFireflies));

    // RAMP UP
    if (activeCount < cycleTarget && frameCount % 4 === 0) {
      for (let i = 0; i < 3; i++) {
        const rx = floor(random(cols));
        const ry = floor(random(rows));
        let f = fireflies[ry][rx];
        if (!f.active) {
          f.active = true;
          f.timer = floor(random(baseThreshold));
          activeCount++;
        }
      }
    }

    // RAMP DOWN
    if (activeCount > cycleTarget && frameCount % 3 === 0) {
      let deactivated = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let f = fireflies[y][x];
          if (f.active && random() < 0.15) {
            f.active = false;
            activeCount--;
            deactivated++;
            if (activeCount <= cycleTarget || deactivated >= 8) break;
          }
        }
        if (activeCount <= cycleTarget || deactivated >= 8) break;
      }
    }

    // FLASH INFLUENCE
    const flashInfluence = [];
    for (let y = 0; y < rows; y++) {
      flashInfluence[y] = [];
      for (let x = 0; x < cols; x++) {
        let f = fireflies[y][x];
        if (!f.active) {
          flashInfluence[y][x] = 0;
          continue;
        }

        let count = 0;
        for (let dy = -syncRadius; dy <= syncRadius; dy++) {
          for (let dx = -syncRadius; dx <= syncRadius; dx++) {
            let nx = x + dx;
            let ny = y + dy;
            if (
              nx >= 0 && nx < cols &&
              ny >= 0 && ny < rows &&
              !(dx === 0 && dy === 0)
            ) {
              let neighbor = fireflies[ny][nx];
              if (neighbor && neighbor.active && neighbor.flashing) {
                count++;
              }
            }
          }
        }
        flashInfluence[y][x] = count;
      }
    }

    // UPDATE FIREFLIES
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let f = fireflies[y][x];
        if (!f.active) continue;

        f.timer += 1 + flashInfluence[y][x] * (influence / 100);
        if (f.timer >= f.threshold) {
          f.timer = 0;
          f.flashTimer = flashDuration;
        }

        f.flashing = f.flashTimer > 0;
        if (f.flashTimer > 0) f.flashTimer--;

        if (f.flashing) {
          ellipse(
            x * dotSize + dotSize / 2,
            y * dotSize + dotSize / 2,
            dotSize * 0.9
          );
        }
      }
    }

    const sidebarEl = document.getElementById('debugSidebar');
    if (showFireflySidebar) {
      drawDebugSidebar();
    } else if (sidebarEl) {
      sidebarEl.style.display = 'none';
    }
  };

  function drawDebugSidebar() {
    const sidebar = ensureDebugSidebarElement();
    sidebar.style.display = 'block';

    const triangle = triangleWave(cyclePhase);
    const triangleVal = triangle.toFixed(2);
    const phaseNorm = (cyclePhase % (Math.PI * 2)) / (Math.PI * 2);
    const phaseX = Math.floor(phaseNorm * 120);

    const trianglePath = (() => {
      let d = 'M 0 40';
      for (let i = 0; i <= 120; i++) {
        const p = (i / 120) * Math.PI * 2;
        const y = 40 - triangleWave(p) * 40;
        d += ` L ${i} ${y.toFixed(1)}`;
      }
      return d;
    })();

    sidebar.innerHTML = `
      <strong>Firefly Debug</strong><br/>
      Frame: ${frameCount}<br/>
      Active: ${activeCount}<br/>
      Target: ${cycleTarget}<br/>
      Phase: ${cyclePhase.toFixed(2)}<br/>
      Triangle: ${triangleVal}<br/>
      <svg width="120" height="40" style="margin-top: 10px; border:1px solid #ccc; background:#fff;">
        <path d="${trianglePath}" fill="none" stroke="black" stroke-width="1"/>
        <line x1="${phaseX}" y1="0" x2="${phaseX}" y2="40" stroke="red" stroke-width="1"/>
      </svg>
    `;
  }

  function ensureDebugSidebarElement() {
    let el = document.getElementById('debugSidebar');
    if (!el) {
      el = document.createElement('div');
      el.id = 'debugSidebar';
      el.style.position = 'absolute';
      el.style.top = '10px';
      el.style.right = '10px';
      el.style.background = 'white';
      el.style.color = 'black';
      el.style.border = '1px solid #ccc';
      el.style.padding = '10px';
      el.style.fontFamily = 'monospace';
      el.style.fontSize = '12px';
      el.style.zIndex = '10';
      document.body.appendChild(el);
    }
    return el;
  }

  window.getControls = function () {
    return [
      {
        type: 'range',
        label: 'Cycle Speed',
        min: 0.001,
        max: 0.05,
        step: 0.001,
        value: cycleSpeed,
        onInput: val => (cycleSpeed = val),
      },
      {
        type: 'range',
        label: 'Min Fireflies',
        min: 1,
        max: rows * cols,
        step: 1,
        value: minFireflies,
        onInput: val => (minFireflies = val),
      },
      {
        type: 'range',
        label: 'Max Fireflies',
        min: 1,
        max: rows * cols,
        step: 1,
        value: maxFireflies,
        onInput: val => (maxFireflies = val),
      },
      {
        type: 'range',
        label: 'Sync Radius',
        min: 1,
        max: 10,
        step: 1,
        value: syncRadius,
        onInput: val => (syncRadius = val),
      },
      {
        type: 'range',
        label: 'Influence',
        min: 0.001,
        max: 0.1,
        step: 0.001,
        value: influence,
        onInput: val => (influence = val),
      },
      {
        type: 'button',
        label: () => showFireflySidebar ? 'Hide Debug Sidebar' : 'Show Debug Sidebar',
        onClick: () => {
          showFireflySidebar = !showFireflySidebar;
          if (typeof renderControls === 'function') renderControls(getControls());
        },
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
