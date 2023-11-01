const obtenerDiasDeLaSemana = (dates) => {
  let fechasCompletas = [];
  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  dates.forEach((date) => {
    const [day, month, year] = date.split("/");
    const formattedDate = new Date(`${month}/${day}/${year}`);
    const dayOfWeek = formattedDate.getDay();

    fechasCompletas.push(`${daysOfWeek[dayOfWeek]}&${date}`);
  });
  return fechasCompletas;
};

export default obtenerDiasDeLaSemana;
