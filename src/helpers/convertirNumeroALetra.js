function numeroALetra(numero) {
  // Calcula el código ASCII para la letra
  const letra = String.fromCharCode(96 + numero); // 96 es la posición antes de "a"
  return letra;
}

export default numeroALetra;
