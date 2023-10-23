let diasDeLaSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const obtenerDiaSiguienteNombre = (nombre) => {
  let diaNumero = diasDeLaSemana.indexOf(nombre);
  if (diaNumero >= 6) {
    return diasDeLaSemana[0];
  } else {
    return diasDeLaSemana[diaNumero + 1];
  }
};

export default obtenerDiaSiguienteNombre;
