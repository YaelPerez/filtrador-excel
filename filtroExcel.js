const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function procesarExcel(rutaEntrada) {
  const workbook = XLSX.readFile(rutaEntrada);
  const sheetName = workbook.SheetNames[0];
  const datos = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

  const conteo = {};

  for (let fila of datos) {
    const articulo = fila[0];
    if (articulo) {
      conteo[articulo] = (conteo[articulo] || 0) + 1;
    }
  }

  const libroSalida = new ExcelJS.Workbook();
  const hoja = libroSalida.addWorksheet('Artículos');

  hoja.columns = [
    { header: 'Artículo', key: 'articulo', width: 30 },
    { header: 'Cantidad', key: 'cantidad', width: 15 },
  ];

  for (let [articulo, cantidad] of Object.entries(conteo)) {
    hoja.addRow({ articulo, cantidad });
  }

  const salidaPath = path.join(__dirname, 'output');
  if (!fs.existsSync(salidaPath)) fs.mkdirSync(salidaPath);

  const rutaFinal = path.join(salidaPath, 'resultado.xlsx');
  await libroSalida.xlsx.writeFile(rutaFinal);
  return rutaFinal;
}

module.exports = { procesarExcel };
