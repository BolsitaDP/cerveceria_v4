function obtenerTituloPDFExportar(input) {
  // Dividir el string
  const days = input.split("¬");

  // Obtener el primer y último día
  const firstDay = days[0].split("&")[1]; // "28/10/2024"
  const lastDay = days[days.length - 1].split("&")[1]; // "03/11/2024"

  // Función para obtener el mes y el año en letras
  const getMonthAndYear = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return {
      day: day,
      month: monthNames[parseInt(month) - 1],
      year: year,
    };
  };

  // Obtener detalles del primer y último día
  const firstDayDetails = getMonthAndYear(firstDay);
  const lastDayDetails = getMonthAndYear(lastDay);

  // Crear objeto de resultado
  const result = {
    primerDia: firstDayDetails.day, // Solo el día
    ultimoDia: lastDayDetails.day, // Solo el día
    anio: firstDayDetails.year, // El año es el mismo para ambos días
    mes: firstDayDetails.month, // El mes es el mismo para ambos días
  };

  return result;
}

export default obtenerTituloPDFExportar;
