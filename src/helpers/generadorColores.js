function generarColores(cantidad = 256) {
  const colores = [];
  for (let i = 0; i < cantidad; i++) {
    // Generar valores RGB aleatorios
    const r = Math.floor(Math.random() * (255 - 192 + 1)) + 192;
    const g = Math.floor(Math.random() * (255 - 192 + 1)) + 192;
    const b = Math.floor(Math.random() * (255 - 192 + 1)) + 192;

    // Convertir a hexadecimal y agregar a la lista
    const colorHex = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    colores.push(colorHex);
  }
  return colores;
}

export default generarColores;
