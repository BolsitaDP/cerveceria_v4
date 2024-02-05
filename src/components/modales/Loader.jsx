import React from "react";
import { Circles } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loaderContainer">
      <Circles
        height="80"
        width="80"
        color="#007aff"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      <div className="textLoader">Cargando datos...</div>
    </div>
  );
};

export default Loader;
