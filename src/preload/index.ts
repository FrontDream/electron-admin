import type { MessageBoxOptions } from 'electron';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Bridge', {
  log: (params: any[]) => {
    ipcRenderer.invoke('log', params);
  },
  showMessage: (options: MessageBoxOptions) => {
    console.log('options:', options);

    ipcRenderer.invoke('showMessage', options);
  },
  createNotebook: (name: string) => {
    ipcRenderer.invoke('createNotebook', name);
  },
  getNotebooks: () => {
    return ipcRenderer.invoke('getNotebooks');
  },
});
