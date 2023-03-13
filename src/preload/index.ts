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
  createNotebook: (name: string, blob: Blob) => {
    ipcRenderer.invoke('createNotebook', name, blob);
  },
  getNotebooks: () => {
    return ipcRenderer.invoke('getNotebooks');
  },
  saveFile: ()=>{
    return ipcRenderer.invoke('saveFile');
  }
});
