function convertirFecha(fecha) {
  var partesFecha = fecha.split("/");
  var dia = parseInt(partesFecha[0], 10);
  var mes = parseInt(partesFecha[1], 10);

  var meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  var nombreMes = meses[mes - 1];

  var resultado = dia + " de " + nombreMes;

  return resultado;
}

export default convertirFecha;
