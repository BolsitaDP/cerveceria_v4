const obtenerDiaSiguienteFecha = (fecha) => {
  // Obtener los componentes de la fecha actual
  let [dia, mes, año] = fecha.split("/");

  // Crear un objeto Date con la fecha actual
  let fechaActual = new Date(Number(año), Number(mes) - 1, Number(dia));

  // Obtener el día siguiente sumando 1 al valor del día
  let fechaSiguiente = new Date(fechaActual.getTime() + 86400000);

  // Obtener los componentes de la fecha siguiente
  let diaSiguiente = fechaSiguiente.getDate();
  let mesSiguiente = fechaSiguiente.getMonth() + 1;
  let añoSiguiente = fechaSiguiente.getFullYear();

  // Construir el string con el día siguiente en el formato "dd/mm/yyyy"
  let diaSiguienteFormato = `${diaSiguiente
    .toString()
    .padStart(2, "0")}/${mesSiguiente
    .toString()
    .padStart(2, "0")}/${añoSiguiente}`;

  return diaSiguienteFormato;
};

export default obtenerDiaSiguienteFecha;
