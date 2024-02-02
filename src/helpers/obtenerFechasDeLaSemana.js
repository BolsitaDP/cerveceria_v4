const obtenerFechasDeLaSemana = (fecha) => {
  let fechajs = new Date(fecha);
  let diaSemana = fechajs.getDay();

  // Ajustar el día de la semana para que sea 0 (lunes) en lugar de 0 (domingo)
  if (diaSemana === 0) {
    diaSemana = 6;
  } else {
    diaSemana--;
  }

  let lunes = new Date(fechajs.getTime() - diaSemana * 86400000);
  const fechasSemana = [];

  for (let i = 0; i < 14; i++) {
    const fechaDia = new Date(lunes.getTime() + i * 86400000);
    const formattedFechaDia = `${fechaDia
      .getDate()
      .toString()
      .padStart(2, "0")}/${(fechaDia.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${fechaDia.getFullYear()}`;
    fechasSemana.push(formattedFechaDia);
  }

  return fechasSemana;
};
export default obtenerFechasDeLaSemana;
