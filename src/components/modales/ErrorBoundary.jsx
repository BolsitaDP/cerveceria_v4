import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Aquí puedes registrar el error a un servicio de registro de errores
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto
      return <h1>Algo salió mal. Por favor, recarga la página.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
