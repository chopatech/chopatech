const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('androidAPI', {
  adbDevices: () => ipcRenderer.invoke('adb-devices'),
  fastbootDevices: () => ipcRenderer.invoke('fastboot-devices'),
  flashBoot: (imagePath) => ipcRenderer.invoke('flash-boot', imagePath)
});