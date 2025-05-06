// sketch.js loads animations and handles WebSocket communication with the flipdot display
//webcocket server allows the flipdot display to be updated with animations or static frames.

let socket;
let currentAnimScript = null;
let dotSize = 20;
const cols = 28;
const rows = 14;
let currentFrameRate = 30; // default is 30 but can be changed by the animation script thats loaded if its window.getControls = function ()  has a control for it.

function setup() {
  const cnv = createCanvas(cols * dotSize, rows * dotSize);
  cnv.parent('canvas-holder'); // 🔹 Add this line to place the canvas where you want it

  cnv.elt.oncontextmenu = () => false; // disable right-click menu on canvas
  frameRate(30);
  pixelDensity(1);

  socket = new WebSocket('ws://localhost:3000');
  socket.onopen = () => console.log('✅ WebSocket connected');
  socket.onerror = err => console.error('❌ WebSocket error', err);
}

  function draw() { //this function is the one that sends the current frame to the flipdot display`
   // background(255);
  
    if (typeof drawFrame === 'function') {
      drawFrame();
    }
    sendFrameToFlipdot();  //convert the current frame to bits and send it to the flipdot display
  
  }
  

function mousePressed() {
  if (typeof window.mousePressed === 'function' && window.mousePressed !== mousePressed) {
    window.mousePressed();
  }
}

// Function to send the current frame to the flipdot display
function sendFrameToFlipdot() {
  loadPixels();
  let topBits = [];
  let bottomBits = [];

  for (let x = 0; x < 28; x++) {
    for (let y = 13; y >= 0; y--) {
      let px = x * dotSize + 5;
      let py = (13 - y) * dotSize + 5;
      let idx = (py * width + px) * 4;
      let brightness = pixels[idx];
      let bit = brightness < 128 ? 1 : 0;
      if (y >= 7) bottomBits.push(bit);
      else topBits.push(bit);
    }
  }
  // Ensure both arrays are 196 bits long (28 columns * 7 rows)
  let bits = topBits.concat(bottomBits);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "frame", bits }));
  }
}

// Function to render controls based on the provided control elements
function loadAnimation() {
  const controlsDiv = document.getElementById('controls');
  if (controlsDiv) controlsDiv.innerHTML = '';

  const selected = document.getElementById('animSelector').value;
  if (currentAnimScript) document.body.removeChild(currentAnimScript); //this if statement removes the previous script if it exists
  drawFrame = undefined;
  mousePressed = undefined;
  getControls = undefined;
  const script = document.createElement('script');  // Create a new script element
  script.src = 'js/anims/' + selected + '.js?v=' + new Date().getTime(); // this line sets the source of the script to the selected animation file
  script.onload = () => {
    console.log(`✅ Loaded animation: ${selected}`);
    if (typeof getControls === 'function') {  // Check if getControls function exists
      renderControls(getControls());
    }
  };
  
  script.onerror = () => console.error(`❌ Failed to load: ${selected}`); // Error handling for script loading
  document.body.appendChild(script);
  currentAnimScript = script;
}


window.addEventListener('DOMContentLoaded', () => {
  const loadBtn = document.getElementById('loadButton');
  if (loadBtn) loadBtn.addEventListener('click', loadAnimation);
});

