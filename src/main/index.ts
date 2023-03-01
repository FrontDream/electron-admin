import 'reflect-metadata';
import type { MessageBoxOptions } from 'electron';
import { app, BrowserWindow, protocol, Menu, ipcMain, dialog } from 'electron';
import path from 'path';
import createProtocol from 'umi-plugin-electron-builder/lib/createProtocol';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { ioc } from './ioc';
import { LocalDB } from './db/db';
import { NotebooksController } from './db/controllers/notebooks.controller';

const isDevelopment = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      devTools: app.isPackaged ? false : true,
      contextIsolation: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.PORT || '8000'}`);
  } else {
    // The production environment hides menus
    Menu.setApplicationMenu(null);

    createProtocol('app');
    mainWindow.loadURL('app://./index.html');
  }
}
app.whenReady().then(async () => {
  if (isDevelopment) {
    // Install React Devtools
    try {
      await installExtension(REACT_DEVELOPER_TOOLS);
    } catch (e) {
      console.error('React Devtools failed to install:', e.toString());
    }
  }
  await ioc.get(LocalDB).init();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 || mainWindow === null) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('showMessage', (e, options: MessageBoxOptions) => {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  if (!win) return;
  dialog.showMessageBox(win, options);
});

ipcMain.handle('createNotebook', async (e, name: string) => {
  return await ioc.get(NotebooksController).create(name);
});

ipcMain.handle('getNotebooks', async () => {
  return await ioc.get(NotebooksController).getAll();
});
