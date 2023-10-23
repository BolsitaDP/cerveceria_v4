const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api_cerveceria",
    createProxyMiddleware({
      target: "https://icasa.bpmco.co",
      changeOrigin: true,
      secure: false,
    })
  );
};
