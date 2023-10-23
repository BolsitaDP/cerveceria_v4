const ordenarSolicitudes = (solicitudes, propiedad) => {
  if (propiedad === "Fecha") {
    const solicitudesOrdenadas = [...solicitudes].sort((a, b) => {
      let fechaAFormatted = a.fechaRequiere;
      let fechaBFormatted = b.fechaRequiere;
      let [diaFecha1, mesFecha1, añoFecha1] = fechaAFormatted.split("/");
      let [diaFecha2, mesFecha2, añoFecha2] = fechaBFormatted.split("/");
      const fechaA = new Date(añoFecha1, mesFecha1 - 1, diaFecha1);
      const fechaB = new Date(añoFecha2, mesFecha2 - 1, diaFecha2);
      return fechaA.getTime() - fechaB.getTime();
    });
    return solicitudesOrdenadas;
  } else if (propiedad === "Cantidad") {
    const solicitudesOrdenadas = [...solicitudes].sort(
      (a, b) => a.cantidad - b.cantidad
    );
    return solicitudesOrdenadas;
  }
};

export default ordenarSolicitudes;
