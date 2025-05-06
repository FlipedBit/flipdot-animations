(() => {
  console.log('[scroll_text] Loaded');

  // === LOCAL STATE ===
  let scrollFont;
  let scrollMsg = 'The quick brown fox jumps over the lazy dog.';
  let scrollX = 0;
  let textBuffer;

  let scrollSpeed = 8;
  let textSizeMultiplier = 14;
  let scrollDirection = 'rtl';
  let scrollFontFile = 'VampiroOne-Regular.ttf';
  let availableFonts = [];
  let verticalOffset = 0;

  // === FONT LOADING ===
  function loadFontFile(fontFile) {
    scrollFontFile = fontFile;
    scrollFont = null;
    textBuffer = null;
    scrollX = 0;

    loadFont('fonts/' + scrollFontFile,
      font => {
        scrollFont = font;
        console.log('[scroll_text] Font loaded:', scrollFontFile);
        setupScrollText();
      },
      err => {
        console.error('[scroll_text] Failed to load font:', scrollFontFile, err);
      }
    );
  }

  // === SETUP TEXT BUFFER ===
  function setupScrollText() {
    if (!scrollFont) return;

    const bufferHeight = rows * dotSize + dotSize +6;

    const temp = createGraphics(1, 1);
    temp.textFont(scrollFont);
    temp.textSize(dotSize * textSizeMultiplier);
    const textW = temp.textWidth(scrollMsg);
    const bufferWidth = Math.max(textW + dotSize * 4, width);

    textBuffer = createGraphics(bufferWidth, bufferHeight);
    textBuffer.pixelDensity(1);
    textBuffer.background(255);
    textBuffer.fill(0);
    textBuffer.noStroke();
    textBuffer.textFont(scrollFont);
    textBuffer.textSize(dotSize * textSizeMultiplier);
    textBuffer.textAlign(LEFT, BASELINE);

    const bbox = scrollFont.textBounds(scrollMsg, 0, 0, dotSize * textSizeMultiplier);
    const baselineY = (bufferHeight - bbox.h) / 2 - bbox.y + verticalOffset + dotSize * 0.2;
    
    textBuffer.text(scrollMsg, 0, Math.round(baselineY));
    //textBuffer.text(scrollMsg, 0, baselineY);

    scrollX = (scrollDirection === 'rtl') ? width : -textBuffer.width;
  }

  // === DRAW LOOP ===
  window.drawFrame = function () {
    if (!textBuffer) return;

    background(255);
    image(textBuffer, scrollX, 0);

    if (scrollDirection === 'rtl') {
      scrollX -= scrollSpeed;
      if (scrollX < -textBuffer.width) scrollX = width;
    } else {
      scrollX += scrollSpeed;
      if (scrollX > width) scrollX = -textBuffer.width;
    }
  };

  // === MOUSE RESET ===
  window.mousePressed = function () {
    if (!scrollFont) {
      console.warn('[scroll_text] Font still loading');
      return;
    }
    if (!textBuffer) {
      console.log('[scroll_text] Initializing textBuffer after click');
      setupScrollText();
    }
    scrollX = -textBuffer.width;
  };

  // === CONTROL HANDLERS ===
  function updateScrollMessage(val) {
    scrollMsg = val || 'HELLO FLIPDOT!';
    setupScrollText();
  }

  function updateTextSize(val) {
    textSizeMultiplier = val;
    setupScrollText();
  }

  function updateScrollSpeed(val) {
    scrollSpeed = val;
  }

  function updateDirection(val) {
    scrollDirection = val;
    setupScrollText();
  }

  function updateVerticalOffset(val) {
    verticalOffset = val;
    setupScrollText();
  }

  // === UI CONTROLS ===
  window.getControls = function () {
    return [
      {
        type: 'input',
        label: 'Message',
        id: 'scrollTextInput',
        value: scrollMsg,
        onInput: updateScrollMessage,
      },
      {
        type: 'select',
        label: 'Font',
        id: 'fontSelector',
        options: availableFonts.map(f => ({ label: f.name, value: f.file })),
        value: scrollFontFile,
        onChange: loadFontFile,
      },
      {
        type: 'range',
        label: 'Text Size',
        id: 'textSizeSlider',
        min: 5,
        max: 15,
        step: 1,
        value: textSizeMultiplier,
        onInput: updateTextSize,
      },
      {
        type: 'range',
        label: 'Scroll Speed',
        id: 'speedSlider',
        min: 0.1,
        max: 20,
        step: 0.1,
        value: scrollSpeed,
        onInput: updateScrollSpeed,
      },
      {
        type: 'select',
        label: 'Direction',
        id: 'directionSelect',
        options: [
          { label: 'Right to Left', value: 'rtl' },
          { label: 'Left to Right', value: 'ltr' },
        ],
        value: scrollDirection,
        onChange: updateDirection,
      },
      {
        type: 'range',
        label: 'Vertical Offset',
        min: -200,
        max: 100,
        step: 10,
        value: verticalOffset,
        onInput: updateVerticalOffset
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

  // === LOAD FONTS ===
  fetch('/fonts')
    .then(res => res.json())
    .then(fontFiles => {
      availableFonts = fontFiles.map(file => ({
        name: file.replace('.ttf', '').replace(/[-_]/g, ' '),
        file
      }));

      if (typeof renderControls === 'function' && typeof getControls === 'function') {
        renderControls(getControls());
      }

      if (!scrollFont && availableFonts.length > 0) {
        const defaultFont = 'VampiroOne-Regular.ttf';
        const match = availableFonts.find(f => f.file === defaultFont);
        loadFontFile(match ? match.file : availableFonts[0].file);
      }
      
    })
    .catch(err => {
      console.error('[scroll_text] Failed to load fonts:', err);
    });
})();
