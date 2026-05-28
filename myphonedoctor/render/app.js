const { ipcRenderer } = require('electron');

const scanBtn = document.getElementById('scanBtn');
const statusText = document.getElementById('statusText');

scanBtn.addEventListener('click', async () => {

  statusText.innerHTML = 'Scanning devices...';

  try {

    const devices = await ipcRenderer.invoke('detect-phone');

    if (devices.error) {

      statusText.innerHTML = devices.error;
      return;
    }

    if (devices.length === 0) {

      statusText.innerHTML = 'No Android device connected.';
      return;
    }

    let html = '';

    devices.forEach(device => {

      html += `

      <div class="device-card">

        <h2>${device.model}</h2>

        <p><strong>Brand:</strong> ${device.brand}</p>

        <p><strong>Manufacturer:</strong> ${device.manufacturer}</p>

        <p><strong>Android:</strong> ${device.android}</p>

        <p><strong>Battery:</strong> ${device.battery}</p>

        <p><strong>CPU:</strong> ${device.cpu}</p>

        <p><strong>Serial:</strong> ${device.serial}</p>

        <p><strong>State:</strong> ${device.state}</p>

        <p><strong>Device ID:</strong> ${device.id}</p>

      </div>

      `;
    });

    statusText.innerHTML = html;

  } catch (err) {

    statusText.innerHTML = err.message;

  }

});