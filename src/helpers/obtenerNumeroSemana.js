function getWeekNumber(fecha) {
  // Divide la fecha en día, mes y año
  const [dia, mes, año] = fecha.split("/").map(Number);

  // Crea un objeto Date usando los valores de día, mes y año
  const date = new Date(año, mes - 1, dia);

  // Ajusta el día al jueves de la semana actual (para seguir el estándar ISO 8601)
  const dayOfWeek = date.getDay() || 7; // Domingo como 7 en lugar de 0
  date.setDate(date.getDate() + (4 - dayOfWeek));

  // Calcula el primer día del año
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);

  // Calcula la diferencia en días y convierte a número de semanas
  const weekNumber = Math.ceil(((date - firstDayOfYear) / 86400000 + 1) / 7);

  return weekNumber;
}

export default getWeekNumber;
