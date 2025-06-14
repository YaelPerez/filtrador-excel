const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { procesarExcel } = require('./filtroExcel');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('abrir-archivo', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    properties: ['openFile'],
  });

  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('procesar-archivo', async (event, ruta) => {
  try {
    const salida = await procesarExcel(ruta);
    return { ok: true, ruta: salida };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
