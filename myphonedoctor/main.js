const { app, BrowserWindow, ipcMain } = require('electron');
const adb = require('adbkit');

const client = adb.createClient();

function createWindow() {

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#0b1020',

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('render/index.html');

  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

ipcMain.handle('detect-phone', async () => {

  try {

    const devices = await client.listDevices();

    if (devices.length === 0) {
      return [];
    }

    const result = [];

    for (const device of devices) {

      result.push({
        id: device.id,
        model: 'Android Device',
        brand: 'Connected',
        manufacturer: 'ADB',
        android: 'Detected',
        battery: 'Unknown',
        cpu: 'Unknown',
        serial: device.id,
        state: device.type
      });

    }

    return result;

  } catch (err) {

    return {
      error: err.message
    };

  }

});