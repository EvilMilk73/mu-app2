const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = "https://localhost:7125/";

const context = [
    "/swagger",
    "/weatherforecast",
    "/login",
    "/Customer",
    "/Cargo",
    "/Waypoint",
];

const onError = (err, req, resp, target) => {
    console.error(`${err.message}`);
}

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    proxyTimeout: 10000,
    target: target,
    // Handle errors to prevent the proxy middleware from crashing when
    // the ASP NET Core webserver is un available
    onError: onError,
    secure: false,
    // Uncomment this line to add support for proxying websockets
    //ws: true, 
    headers: {
      Connection: 'Keep-Alive'
    }
  });
const appProxy2 = createProxyMiddleware(
  "/chatHub",
  {
    proxyTimeout:10000,
    target: target,
    onError:onError,
    secure:false,
    ws:true,    
    
  }
)
  app.use(appProxy);
  app.use(appProxy2);
};
