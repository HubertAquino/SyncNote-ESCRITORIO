const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const devUrl = process.env.ELECTRON_RENDERER_URL;
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (devUrl) {
    mainWindow.loadURL(devUrl).catch((err) => {
      console.error('Fallo al cargar URL de dev, haciendo fallback a dist:', err);
      mainWindow.loadFile(indexPath);
    });
    mainWindow.webContents.on('did-fail-load', (e, code, desc) => {
      console.error('did-fail-load:', code, desc);
      mainWindow.loadFile(indexPath);
    });
    mainWindow.webContents.on('render-process-gone', (e, details) => {
      console.error('render-process-gone', details);
    });
    if (process.env.ELECTRON_OPEN_DEVTOOLS === 'true') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  } else {
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
