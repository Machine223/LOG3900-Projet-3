import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let window: BrowserWindow = null;
const args = process.argv.slice(1);
const isDevelopmentMode = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  window = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: isDevelopmentMode ? true : false,
      enableRemoteModule: true,
    },
  });

  if (isDevelopmentMode) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    window.loadURL('http://localhost:4200');
  } else {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  deleteWindows();

  return window;
}

function deleteWindows(): void {
  window.on('closed', () => {
    window = null;
  });
}

function handleDockMacOS(): void {
  app.on('activate', () => {
    if (window === null) {
      createWindow();
    }
  });
}

function handleQuitMacOS(): void {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

app.on('ready', () => setTimeout(createWindow, 400));
handleQuitMacOS();
handleDockMacOS();
