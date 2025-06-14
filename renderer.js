const cargarBtn = document.getElementById('cargar');
const estado = document.getElementById('estado');

cargarBtn.addEventListener('click', async () => {
  const ruta = await window.api.abrirArchivo();
  if (!ruta) return;

  estado.textContent = 'Procesando archivo...';

  const resultado = await window.api.procesarArchivo(ruta);
  if (resultado.ok) {
    estado.textContent = 'Archivo generado: ' + resultado.ruta;
  } else {
    estado.textContent = 'Error: ' + resultado.error;
  }
});