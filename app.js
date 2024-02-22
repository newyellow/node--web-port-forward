// script from Stackoverflow
// https://stackoverflow.com/questions/6490898/node-js-forward-all-traffic-from-port-a-to-port-b

var net = require('net');

// newyellow.xyz http: 606
// newyellow.xyz https: 6006

// sketch.newyellow.xyz http: 1234
// sketch.newyellow.xyz https: 2234

//pm2 start app.js --name "site.http" -- newyellow.xyz:80 606
//pm2 start app.js --name "site.https" -- newyellow.xyz:443 6006
//pm2 start app.js --name "sketch.http forward" -- sketch.newyellow.xyz:80 1234
//pm2 start app.js --name "sketch.https forward" -- sketch.newyellow.xyz:443 2234

// parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
console.log(process.argv);

var addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;

var addr = {
    from: addrRegex.exec(process.argv[2]),
    to: addrRegex.exec(process.argv[3])
};

console.log(addr.from);
console.log(addr.to);

if (!addr.from || !addr.to) {
    console.log('Usage: <from> <to>');
    return;
}

net.createServer(function(from) {
    console.log('client connected');
    // console.log(from);
    console.log(from.remoteAddress + ':' + from.remotePort);
    console.log(from.localAddress + ':' + from.localPort);
    
    var to = net.createConnection({
        host: addr.to[2],
        port: addr.to[3]
    });
    from.pipe(to);
    to.pipe(from);
}).listen(addr.from[3], addr.from[2]);
