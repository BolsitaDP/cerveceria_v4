const { createProxyMiddleware } = require("http-proxy-middleware");

const apiUrl = process.env.REACT_APP_URL;

module.exports = function (app) {
  app.use(
    "/api_cerveceria",
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      secure: false,
      timeout: 5000,
    })
  );
};
