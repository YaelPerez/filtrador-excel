const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { procesarExcel } = require('./filtroExcel');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configurar logs para autoUpdater
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App iniciada. Verificando actualizaciones...');

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

// Evento: app lista
app.whenReady().then(() => {
    createWindow();

    try {
        autoUpdater.checkForUpdates(); // Más flexible que checkForUpdatesAndNotify
    } catch (error) {
        log.error("Error al buscar actualizaciones:", error);
    }
});

// Evento: actualización encontrada
autoUpdater.on("update-available", () => {
    log.info("Hay una nueva actualización disponible.");
});

// Evento: error al actualizar
autoUpdater.on("error", (error) => {
    log.error("Error al actualizar:", error);
});

// Evento: actualización descargada y lista para instalar
autoUpdater.on("update-downloaded", () => {
    log.info("Actualización descargada.");

    // Mostrar ventana para confirmar reinicio
    dialog.showMessageBox({
        type: "info",
        title: "Actualización lista",
        message: "Hay una nueva versión disponible. ¿Deseas reiniciar ahora para actualizar?",
        buttons: ["Sí", "Después"]
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});

// Lógica de archivo
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
