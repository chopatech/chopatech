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

  win.loadFile('renderer/index.html');
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

      const id = device.id;

      async function getProp(prop) {

        try {

          const output = await client.shell(id, `getprop ${prop}`);

          const adbkit = require('adbkit');
          const value = await adbkit.util.readAll(output);

          return value.toString().trim();

        } catch {

          return 'Unknown';

        }

      }

      async function getBattery() {

        try {

          const output = await client.shell(id, 'dumpsys battery');

          const adbkit = require('adbkit');
          const value = await adbkit.util.readAll(output);

          const text = value.toString();

          const match = text.match(/level: (\d+)/);

          return match ? match[1] + '%' : 'Unknown';

        } catch {

          return 'Unknown';

        }

      }

      result.push({

        id,
        model: await getProp('ro.product.model'),
        brand: await getProp('ro.product.brand'),
        android: await getProp('ro.build.version.release'),
        manufacturer: await getProp('ro.product.manufacturer'),
        serial: await getProp('ro.serialno'),
        cpu: await getProp('ro.product.cpu.abi'),
        battery: await getBattery(),
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