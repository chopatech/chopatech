const terminal = document.querySelector('.terminal');

function addLog(message, type = 'green') {
  const line = document.createElement('div');
  line.className = `log-${type}`;
  line.innerText = message;

  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

async function detectADB() {
  addLog('[ADB] Searching for devices...', 'blue');

  const result = await window.androidAPI.adbDevices();

  if (result.success) {
    addLog(result.data, 'green');
  } else {
    addLog(result.error, 'red');
  }
}

async function detectFastboot() {
  addLog('[FASTBOOT] Searching for devices...', 'blue');

  const result = await window.androidAPI.fastbootDevices();

  if (result.success) {
    addLog(result.data, 'green');
  } else {
    addLog(result.error, 'red');
  }
}

async function flashBootImage() {
  const imagePath = 'firmware/boot.img';

  addLog('[FLASH] Flashing boot image...', 'amber');

  const result = await window.androidAPI.flashBoot(imagePath);

  if (result.success) {
    addLog(result.data, 'green');
  } else {
    addLog(result.error, 'red');
  }
}