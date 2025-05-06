const express = require('express');
const http = require('http');
const { SerialPort } = require('serialport');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const flipdot = require('./js/flipdot');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// === CONFIGURE THESE ===
const SERIAL_PORT_PATH = 'COM3'; // e.g., '/dev/ttyUSB0' on Linux or COM3 on Windows
const BAUD_RATE = 57600;

// === SERIAL CONNECTION ===
const serial = new SerialPort({ path: SERIAL_PORT_PATH, baudRate: BAUD_RATE });

serial.on('open', () => console.log('[Serial] Port open'));
serial.on('error', (err) => console.error('[Serial] Error:', err.message));

// === STATIC FILES ===
app.use(express.static(path.join(__dirname, 'public'))); // Serves index.html, style.css
app.use('/js', express.static(path.join(__dirname, 'js'))); // Serve JS files outside /public
app.use('/fonts', express.static(path.join(__dirname, 'fonts'))); // Serve TTFs for p5.loadFont

// === WEBSOCKET CONNECTION ===
wss.on('connection', ws => {
  console.log('[WebSocket] Client connected');

  ws.on('message', (message) => {
    try {
      const text = message.toString(); // 👈 this is key!
      const data = JSON.parse(text);   // 👈 then parse the string

      if (data.type === 'frame' && Array.isArray(data.bits) && data.bits.length === 392) {
        sendToFlipdot(data.bits);
      } else {
        console.warn('[WebSocket] Frame rejected: invalid or incomplete bit array.');
      }

    } catch (e) {
      console.error('[WebSocket] Failed to parse or process message.');
      console.error('Message content:', message.toString());
      console.error('Error:', e.message);
    }
  });
});

// === PULL ANIMATION NAMES FOR DROPDOWN ===
app.get('/animations', (req, res) => {
  const animDir = path.join(__dirname, 'js', 'anims');
  fs.readdir(animDir, (err, files) => {
    if (err) {
      console.error('Error reading animations folder:', err);
      return res.status(500).json({ error: 'Could not read animations folder' });
    }

    const anims = files
      .filter(f => f.endsWith('.js'))
      .map(f => path.basename(f, '.js'));

    res.json(anims);
  });
});
// === PULL FONT NAMES FOR DROPDOWN ===
app.get('/fonts', (req, res) => {
  const fontDir = path.join(__dirname, 'public', 'fonts');
  fs.readdir(fontDir, (err, files) => {
    if (err) {
      console.error('Error reading fonts folder:', err);
      return res.status(500).json({ error: 'Could not read fonts folder' });
    }

    const ttfFiles = files.filter(f => f.endsWith('.ttf'));
    res.json(ttfFiles);
  });
});


// === SEND FRAME TO FLIPDOT ===
function sendToFlipdot(bitFrame) {
  const half = bitFrame.length / 2;
  const top = bitFrame.slice(0, half);
  const bottom = bitFrame.slice(half);

  const hexTop = flipdot.bit_arr_to_hex_str(top);
  const hexBottom = flipdot.bit_arr_to_hex_str(bottom);

  const cmdTop = flipdot.hex_str_to_command(hexTop, 0, true);
  const cmdBottom = flipdot.hex_str_to_command(hexBottom, 1, true);

  serial.write(Buffer.from(cmdTop + cmdBottom, 'hex'));
}


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[Server] Listening on http://localhost:${PORT}`);
});
