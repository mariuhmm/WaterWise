/* eslint-disable */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.BACKEND_PROXY,
            changeOrigin: true, //stop here for original
            onProxyReq: (proxyReq, req, res) => {
                console.log('Proxying request to:', 'http://localhost:8080');
                console.log('Original request path:', req.originalUrl);
                console.log('Proxied request path:', proxyReq.path);
            },
            onError: (err, req, res) => {
                console.error('Proxy error:', err);
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log('Received response from target:', proxyRes.statusCode);
            },
        })
    );
};
