const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  abrirArchivo: () => ipcRenderer.invoke('abrir-archivo'),
  procesarArchivo: (ruta) => ipcRenderer.invoke('procesar-archivo', ruta),
});
