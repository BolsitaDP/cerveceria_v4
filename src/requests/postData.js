import peticion from "./service";

const postData = {
  postActualizarEstadoAcciones(body) {
    return peticion.post("AccionesProgramacionController/handle", {
      listado: body,
    });
  },

  postActualizarEstadoCopia(body) {
    return peticion.post("ProgramacionController/clone", {
      id: body.id,
      cantidad: body.cantidad,
      codigoNombre: body.codigoNombre,
      estado: body.estado,
      salonProgramado: body.salonProgramado,
      fecha: body.fecha,
      orden: body.orden,
      velocidadesSalonProducto: body.velocidadesSalonProducto,
    });
  },

  postActualizarEstadoProducto(body) {
    try {
      return peticion.post("ProgramacionController/updateStatus", {
        listado: body,
      });
    } catch (error) {
      console.log(error);
    }
  },

  postActualizarPropiedades(body) {
    return peticion.post("ProgramacionController/updateProducto", {
      id: body.id,
      proceso: body.proceso,
      codigoNombre: body.codigoNombre,
      producto: body.producto,
      cantidad: parseInt(body.cantidad),
      unidadMedida: body.unidadMedida,
      marca: body.marca,
      formula: body.formula,
      codigoFormula: body.codigoFormula,
      cantidadProgramada: body.cantidadProgramada,
      volumen: body.volumen,
      envase: body.envase,
      empaque: body.empaque,
      tapa: body.tapa,
      fechaRequiere: body.fechaRequiere,
      paisDestino: body.paisDestino,
      fechaProduccion: body.fechaProduccion,
      fechaExpiracion: body.fechaExpiracion,
      observaciones: body.observaciones,
      version: body.version,
      pais: body.pais,
      planta: body.planta,
      salon: body.salon,
      salonProgramado: body.salonProgramado,
      estado: body.estado,
      semana: body.semana,
      fecha: body.fecha,
      datosReales: body.datosReales,
      orden: body.orden,
      codigoNombreTransformado: body.codigoNombreTransformado,
      productoTransformado: body.productoTransformado,
      cantidadTransformada: body.cantidadTransformada,
      unidadMedidaTransformada: body.unidadMedidaTransformada,
      observacionesGenerales: body.observacionesGenerales,
      cantidadExportacion: body.cantidadExportacion,
      velocidadesSalonProducto: body.velocidadesSalonProducto,
      tipoRequerimiento: body.tipoRequerimiento,
    });
  },

  postCrearAccion(body) {
    return peticion.post("AccionController/save", {
      Id: body.Id || body.idDnd,
      duracion: body.duracion,
      estado: body.estado,
      nombreDeLaAccion: body.nombreDeLaAccion,
      tipo: body.tipo,
      hexa: body.hexa,
    });
  },

  postCrearCorreos(body) {
    return peticion.post("CorreosController/save", {
      idGrupo: body.groupId,
      correo: body.correo,
      id: body.id,
    });
  },

  postCrearGrupos(body) {
    return peticion.post("GruposController/save", {
      nombre: body.nombre,
      id: body.idLocal,
    });
  },

  postEliminarAcciones(body) {
    return peticion.post("AccionController/delete", {
      Id: body.Id || body.idDnd,
      duracion: body.duracion,
      estado: body.estado,
      nombreDeLaAccion: body.nombreDeLaAccion,
      tipo: body.tipo,
    });
  },

  postEliminarAccionesProgramadas(body) {
    return peticion.post("AccionesProgramacionController/delete", {
      Id: body.Id,
      nombreDeLaAccion: body.nombreDeLaAccion,
      salonProgramado: body.salonProgramado,
      fecha: body.fecha,
    });
  },

  postEliminarCorreo(body) {
    return peticion.post("CorreosController/delete", {
      id: body.id,
      idGrupo: body.idGrupo,
      correo: body.correo,
    });
  },

  postEliminarGrupo(body) {
    return peticion.post("GruposController/delete", {
      id: body.idLocal,
      nombre: body.nombre,
    });
  },

  postEnviarPDF(body) {
    return peticion.post("EmailController/send", body);
  },

  postHistorial(body) {
    return peticion.post("HistorialController/save", {
      codigo: body.codigo,
      editor: body.editor,
      fechaDelCambio: body.fechaDelCambio,
      horaDelCambio: body.horaDelCambio,
      notificado: body.notificado,
      propiedad: body.propiedad,
      tipoDeCambio: body.tipoDeCambio,
      valorNuevo: body.valorNuevo,
      valorPrevio: body.valorPrevio,
      version: body.version,
    });
  },

  postEnviarInsumos(body) {
    return peticion.post("InsumosController/insumos", body);
  },

  postSolicitudRepartida(body) {
    return peticion.post("ProgramacionController/updateProducto", {
      id: body.id,
      proceso: body.proceso,
      codigoNombre: body.codigoNombre,
      producto: body.producto,
      cantidad: parseInt(body.cantidad),
      unidadMedida: body.unidadMedida,
      marca: body.marca,
      formula: body.formula,
      volumen: body.volumen,
      envase: body.envase,
      empaque: body.empaque,
      tapa: body.tapa,
      fechaRequiere: body.fechaRequiere,
      paisDestino: body.paisDestino,
      fechaProduccion: body.fechaProduccion,
      fechaExpiracion: body.fechaExpiracion,
      observaciones: body.observaciones,
      cantidadProgramada: body.cantidadProgramada,
      version: body.version,
      pais: body.pais,
      planta: body.planta,
      salon: body.salon,
      salonProgramado: body.salonProgramado,
      estado: body.estado,
      semana: body.semana,
      fecha: body.fecha,
      datosReales: body.datosReales,
      orden: body.orden,
      velocidadesSalonProducto: body.velocidadesSalonProducto,
    });
  },

  postDeleteSolicitud(body) {
    return peticion.post("ProgramacionController/delete", body);
  },
};

export default postData;
