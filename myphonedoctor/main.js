const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 950,

    // 👇 PUT ICON HERE (inside BrowserWindow options)
    icon: path.join(__dirname, 'assets/icon.ico'),

    backgroundColor: '#09090b',
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('adb-devices', async () => {
  return new Promise((resolve) => {
    exec('platform-tools/adb devices', (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message });
        return;
      }

      resolve({ success: true, data: stdout });
    });
  });
});

ipcMain.handle('fastboot-devices', async () => {
  return new Promise((resolve) => {
    exec('platform-tools/fastboot devices', (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message });
        return;
      }

      resolve({ success: true, data: stdout });
    });
  });
});

ipcMain.handle('flash-boot', async (event, imagePath) => {
  return new Promise((resolve) => {
    exec(`platform-tools/fastboot flash boot "${imagePath}"`, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: stderr });
        return;
      }

      resolve({ success: true, data: stdout });
    });
  });
});