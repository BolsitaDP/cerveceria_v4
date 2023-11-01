const getFechaHoraActual = () => {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const anio = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");

  const fechaFormateada = `${dia}/${mes}/${anio}`;
  const horaFormateada = `${horas}:${minutos}`;

  return `${fechaFormateada} - ${horaFormateada}`;
};

export default getFechaHoraActual;
