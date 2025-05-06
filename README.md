# Flipdot Animations

This project is a browser-based animation and control system for physical flip-dot displays, powered by JavaScript, p5.js, and a Node.js WebSocket server. It supports real-time display of animations, remote control, and communication with a flip-dot panel via serial (RS485).

## Features

Modular animation system with live dropdown selection

UI controls for adjusting each animation's behavior

Serial communication with real flip-dot hardware

Web-based interface powered by p5.js

Includes many animations: noise, waves, fireflies, scrolling text, ripple effects, fire simulation, boids, and more

## Hardware Setup

### Flip-dot Display

You’ll need a compatible flip-dot display such as those available from:
👉 https://flipdots.com/en/home/

This project is configured for:

- Display size: 14 rows × 28 columns

- Two panels: Each is 7 rows × 28 columns, stacked on top of eachother

- Top panel address: 0x01

- Bottom panel address: 0x02

- Communication: RS485 via USB-to-serial adapter (e.g., connected on COM3)

- Baud rate: 57600

Ensure your hardware connections and serial drivers are functioning before starting the server.

## Configuration

The relevant hardware communication logic lives in flipdot.js. Make sure the following are set to match your hardware:
```
const PANEL_ADDRS = ['02', '01']; // bottom, top
const ADDR_ALL_PANELS = 'FF';
const baudRate = 57600;           // set in server.js
const serialPortPath = 'COM3';    // adjust to match your system
```
To enable transmission to the physical display, set the global flag in server.js:
```
let ENABLE_TX = true;  // or toggle from the web UI if wired up
```
## Protocol Summary

The flip-dot display accepts serial commands structured as follows:
```
Header (1 byte):        0x80
Command byte (1 byte): 0x83 (cast and update) or 0x84 (cast and store)
Address (1 byte):       e.g., 0x01 (top) or 0x02 (bottom)
Data (28 bytes):        28 columns × 7 bits = 196 bits per panel
End byte (1 byte):      0x8F
```
Each frame is split into top and bottom halves, converted into 7-bit vertical column bytes, hex-encoded, and sent to each panel followed by a final UPDATE_ALL_PANELS command.

## Folder Structure
```
processing_anims/
├── public/
│   ├── index.html          # main web interface
│   ├── style/style.css     # UI styling
│   ├── js/
│   │   ├── sketch.js       # sets up p5 canvas and animation loading
│   │   ├── controls.js     # renders UI sliders and inputs
│   │   ├── flipdot.js      # handles serial communication & rasterization
│   │   ├── anims/          # individual animations
│   │       ├── wave.js
│   │       ├── firefly_sync.js
│   │       ├── scroll_text.js
│   │       └── ...
├── server.js              # Node.js WebSocket + serial server
├── libs/
│   └── p5.min.js          # local copy of p5.js library
```


## Creating New Animations

Each animation is its own file under public/js/anims/ and should follow this pattern:
```
(() => {
  let someVar = 5;
  function drawFrame() {
    // animation logic here
  }
  function getControls() {
    return [
      {
        type: 'range',
        label: 'Some Control',
        min: 0, max: 10, value: someVar,
        onInput: val => someVar = val
      }
    ];
  }
  window.drawFrame = drawFrame;
  window.getControls = getControls;
})();
```
✅ All animations should be wrapped in an IIFE to avoid polluting global scope.

## Local Development

1. Run the server: 
```node server.js```
2. Open browser to http://localhost:3000
3. Use the UI to load animations, adjust controls, and send data to the display
