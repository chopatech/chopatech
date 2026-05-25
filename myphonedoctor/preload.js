const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('androidAPI', {
  onDeviceStatus: (callback) => {
    ipcRenderer.on('device-status', (event, data) => {
      callback(data);
    });
  }
});