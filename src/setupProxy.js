const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api_cerveceria",
    createProxyMiddleware({
      target: "https://sqadccorpwapp1:4430",
      changeOrigin: true,
      secure: false,
    })
  );
};
