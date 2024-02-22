const fs = require('fs');
const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

// newyellow.xyz http: 606
// newyellow.xyz https: 6006

// sketch.newyellow.xyz http: 1234
// sketch.newyellow.xyz https: 2234

//Create a proxy instance
var proxy = httpProxy.createProxy();

proxy.on("error", function (e) {
    //handling error
    console.log('error');
    console.log(e);
});

let httpProxySets = [];
httpProxySets.push({
    'from': 'sketch.newyellow.xyz',
    'to': '127.0.0.1:1234'
});

let httpsProxySets = [];
httpsProxySets.push({
    'from': 'sketch.newyellow.xyz',
    'to': '127.0.0.1:2234'
});


let httpServer = http.createServer(function (req, res) {

    // console.log("Coming From 80");
    // console.log(req.headers.host);

    for (let i = 0; i < httpProxySets.length; i++) {
        if (req.headers.host == httpProxySets[i].from) {
            return proxy.web(req, res, { target: `http://${httpProxySets[i].to}` });
        }
    }

    // if no match, default
    return proxy.web(req, res, { target: 'http://localhost:606' });

});

let sslKeys = {
    key: fs.readFileSync('/etc/letsencrypt/live/newyellow.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/newyellow.xyz/fullchain.pem')
};

let httpsServer = https.createServer(sslKeys, function (req, res) {
    // console.log("Coming From 443");
    // console.log(req.headers.host);

    for (let i = 0; i < httpsProxySets.length; i++) {
        if (req.headers.host == httpsProxySets[i].from) {
            return proxy.web(req, res, { target: `https://${httpsProxySets[i].to}` });
        }
    }

    // if no match, default
    return proxy.web(req, res, { target: 'https://localhost:6006' });

});

httpServer.listen(80, function () {
    console.log('HTTP server is running on port 80');
});

httpsServer.listen(443, function () {
    console.log('HTTPS server is running on port 443');
});
