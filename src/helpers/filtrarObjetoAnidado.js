const filtrarObjetoAnidado = (obj, term) => {
  return Object.values(obj).some((value) => {
    if (typeof value === "object" && value !== null) {
      return filtrarObjetoAnidado(value, term);
    }
    return String(value).toLowerCase().includes(term.toLowerCase());
  });
};

export default filtrarObjetoAnidado;
