function formatearFechaAFormatoDate(fechaStr) {
  let [, fechaDia] = fechaStr.split("&");

  const [dia, mes, año] = fechaDia.split("/");

  const fecha = new Date(año, mes - 1, dia);

  return fecha;
}

export default formatearFechaAFormatoDate;
