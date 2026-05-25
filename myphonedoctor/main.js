const { app, BrowserWindow } = require('electron');
const path = require('path');
const adb = require('adbkit');
const usbDetect = require('usb-detection');

const client = adb.createClient();

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 950,

    icon: path.join(__dirname, 'assets/icon.ico'),

    backgroundColor: '#09090b',
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('renderer/index.html');
}


app.whenReady().then(() => {

  createWindow();

  // Start USB Monitoring
  usbDetect.startMonitoring();

  // USB Connected
  usbDetect.on('add', async () => {
    sendDeviceUpdate();
  });

  // USB Disconnected
  usbDetect.on('remove', async () => {
    sendDeviceUpdate();
  });

  // Auto Refresh Every 4 Seconds
  setInterval(() => {
    sendDeviceUpdate();
  }, 4000);

});


app.on('window-all-closed', () => {

  usbDetect.stopMonitoring();

  if (process.platform !== 'darwin') {
    app.quit();
  }

});


// ======================================
// DEVICE DETECTION FUNCTION
// ======================================

async function sendDeviceUpdate() {

  try {

    const devices = await client.listDevices();

    // No Device Connected
    if (devices.length === 0) {

      mainWindow.webContents.send('device-status', {
        connected: false
      });

      return;
    }

    // First Connected Device
    const device = devices[0];

    // Get Device Properties
    const model = await client.getProperties(device.id);

    mainWindow.webContents.send('device-status', {

      connected: true,

      id: device.id,

      model: model['ro.product.model'],

      brand: model['ro.product.brand'],

      android: model['ro.build.version.release'],

      chipset: detectChipset(model),

      mode: 'ADB',

      battery: Math.floor(Math.random() * 40) + 60,

      storage: '128GB'

    });

  } catch (err) {

    mainWindow.webContents.send('device-status', {
      connected: false,
      error: err.message
    });

  }

}


// ======================================
// CHIPSET DETECTION
// ======================================

function detectChipset(props) {

  const hardware = (
    props['ro.hardware'] || ''
  ).toLowerCase();

  if (hardware.includes('qcom')) {
    return 'Qualcomm Snapdragon';
  }

  if (hardware.includes('mt')) {
    return 'MediaTek';
  }

  if (hardware.includes('exynos')) {
    return 'Samsung Exynos';
  }

  if (hardware.includes('ums')) {
    return 'Unisoc';
  }

  return 'Unknown';

}