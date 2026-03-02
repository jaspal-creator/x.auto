const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('Auto-updater test script started');

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load a simple HTML page
  mainWindow.loadHTML(`
    <html>
      <body>
        <h1>Auto-Updater Test</h1>
        <div id="status">Checking for updates...</div>
        <button onclick="checkForUpdates()">Manual Check</button>
        <div id="logs"></div>
        <script>
          const { ipcRenderer } = require('electron');
          
          function checkForUpdates() {
            ipcRenderer.send('check-updates');
          }
          
          ipcRenderer.on('update-status', (event, message) => {
            document.getElementById('status').innerHTML = message;
            const logs = document.getElementById('logs');
            logs.innerHTML += '<p>' + new Date().toISOString() + ': ' + message + '</p>';
          });
        </script>
      </body>
    </html>
  `);

  // Auto-updater event handlers
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
    mainWindow.webContents.send('update-status', 'Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info);
    mainWindow.webContents.send('update-status', `Update available: ${info.version}`);
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available:', info);
    mainWindow.webContents.send('update-status', 'Update not available');
  });

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err);
    mainWindow.webContents.send('update-status', `Error: ${err.message}`);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
    log.info(message);
    mainWindow.webContents.send('update-status', message);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info);
    mainWindow.webContents.send('update-status', `Update downloaded: ${info.version}`);
  });

  // Handle manual check
  require('electron').ipcMain.on('check-updates', () => {
    log.info('Manual update check triggered');
    autoUpdater.checkForUpdatesAndNotify();
  });

  // Automatic check after 5 seconds
  setTimeout(() => {
    log.info('Starting automatic update check...');
    mainWindow.webContents.send('update-status', 'Starting automatic check...');
    autoUpdater.checkForUpdatesAndNotify();
  }, 5000);

  // Check current version
  log.info('Current version:', app.getVersion());
  mainWindow.webContents.send('update-status', `Current version: ${app.getVersion()}`);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
