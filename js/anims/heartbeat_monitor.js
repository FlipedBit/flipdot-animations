if (typeof waveBuffer === 'undefined') var waveBuffer;
if (typeof bpm === 'undefined') var bpm = 60;
if (typeof spikeHeight === 'undefined') var spikeHeight = 5;
if (typeof baselineY === 'undefined') var baselineY = Math.floor(rows / 2);
if (typeof dotThickness === 'undefined') var dotThickness = 1;
if (typeof sweepSpeed === 'undefined') var sweepSpeed = 1; // columns per frame


let scrollX = 0;
let lastBeatFrame = 0;
let waveform = [];

function generateHeartbeatWave() {
  const totalFrames = Math.floor((60 / bpm) * frameRate());
  waveform = new Array(totalFrames).fill(baselineY);

  const spikePos = Math.floor(totalFrames * 0.2);
  if (spikePos + 3 < waveform.length) {
    waveform[spikePos - 1] = baselineY;
    waveform[spikePos] = baselineY - spikeHeight;
    waveform[spikePos + 1] = baselineY + Math.floor(spikeHeight * 0.5);
    waveform[spikePos + 2] = baselineY;
  }
}

generateHeartbeatWave();

function drawFrame() {
  background(255);

  const val = waveform[frameCount % waveform.length];

  // Scroll effect
  scrollX += sweepSpeed;
  if (scrollX >= waveform.length) scrollX = 0;

  // Shift canvas left and draw latest point
  for (let x = 0; x < width; x++) {
    const i = (scrollX + x) % waveform.length;
    const y = waveform[i];
    fill(0);
    noStroke();
    // Draw the dots
    for (let t = 0; t < dotThickness; t++) {
      if (y + t < rows) {
        const px = x * dotSize;
        const py = (y + t) * dotSize;
        rect(px, py, dotSize, dotSize);
      }
    }
  }

  // Trigger waveform regen if BPM changes mid-animation
  const framesPerBeat = Math.floor((60 / bpm) * frameRate());
  if (frameCount - lastBeatFrame >= framesPerBeat) {
    generateHeartbeatWave();
    lastBeatFrame = frameCount;
  }
}

window.getControls = function () {
  return [
    {
      type: 'range',
      label: 'BPM',
      min: 30,
      max: 180,
      step: 1,
      value: bpm,
      onInput: (val) => {
        bpm = val;
        generateHeartbeatWave();
      },
    },
    {
      type: 'range',
      label: 'Spike Height',
      min: 1,
      max: Math.floor(rows / 2),
      step: 1,
      value: spikeHeight,
      onInput: (val) => {
        spikeHeight = val;
        generateHeartbeatWave();
      },
    },
    {
      type: 'range',
      label: 'Baseline Y',
      min: 0,
      max: rows - 1,
      step: 1,
      value: baselineY,
      onInput: (val) => {
        baselineY = val;
        generateHeartbeatWave();
      },
    },
    {
      type: 'range',
      label: 'Line Thickness',
      min: 1,
      max: 3,
      step: 1,
      value: dotThickness,
      onInput: (val) => {
        dotThickness = val;
      },
    },
    {
        type: 'range',
        label: 'Sweep Speed',
        min: 1,
        max: 5,
        step: 1,
        value: sweepSpeed,
        onInput: (val) => {
          sweepSpeed = val;
        }
      },
  ];
};
