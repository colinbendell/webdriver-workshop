const http = require('http');
const https = require('https');
const url = require('url');
const net = require('net');
const request = require('request');
const fs = require('fs');
const path = require('path');

const resolve = require('./recursive-resolve-dns');

require('events').EventEmitter.defaultMaxListeners = 0;
http.globalAgent.maxSockets = 8;
https.globalAgent.maxSockets = 8;

async function createProxyServer(hostname = 'example.com', dnsHost = null, useTLS = true, testDir="./", otherOptions = {}) {
    let hostIP = await resolve.resolveOne(dnsHost || hostname);

    const simpleMimeType = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'text/json',
        '.jpg': 'text/jpg',
        '.png': 'text/png',
    };

    /**
     * Intercepted local requests are served from the local filesystem. We replace standard {{variable}} values
     * @param req
     * @param res
     */
    const localRequest = (req, res) => {

        let filePath = path.join(testDir, url.parse(req.url).path);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())
            filePath = path.join(filePath, '/index.html');

        // console.log(`LOCAL ${filePath}`);

        let contentType = simpleMimeType[path.extname(filePath) || ".html"] || 'text/html';

        fs.readFile(filePath, "utf8", function(error, content) {
            if (error) {
                res.writeHead(error.code === 'ENOENT' ? 404 : 500);
                res.end();
            }
            else {
                content = content.replace(/{{hostname}}/g, hostname);
                content = content.replace(/{{dnshost}}/g, dnsHost);
                content = content.replace(/{{proto}}/g, useTLS ? "https" : "http");
                content = content.replace(/{{protocol}}/g, useTLS ? "https" : "http");
                content = content.replace(/{{random}}/g, Math.random()*10**8);

                for (const [key, value] of Object.entries(otherOptions))
                    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    };

    /**
     * Pass all requests on to the real origin (unencrypted) except for test files that exist locally
     * @param req
     * @param res
     */
    const onRequest = function(req, res) {
        // console.log(`GET ${req.url}`);
        if (fs.existsSync(path.join(testDir, url.parse(req.url).path)))
            return localRequest(req, res);

        if (new RegExp(hostname).test(req.url)) {
            req.url = req.url.replace(hostname, hostIP);
            req.headers['host'] = hostname;
        }
        request({url: req.url, headers: req.headers})
            .on('error', e => {
                //console.log(e);
                res.writeHead(e && e.code === 'ENOENT' ? 404 : 500);
                res.end();
//                return res.end(e);
            })
            .pipe(res);
    };

    /**
     * if this is a HTTPS request, the UA will send a CONNECT request first. Usually we would just forward this
     * to the real origin, but if it is a STAGING environment we will use the DNS Host to resolve the socket connection.
     * This way the client doesn't have to edit silly /etc/hosts files in order to connect to an `edgekey-staging.net` request
     *
     * @param req
     * @param clientSocket
     * @param head
     */
    const onConnect = function(req, clientSocket, head) {
        // console.log(`CONNECT ${req.url}`);
        const requestUrl = url.parse(`http://${req.url}`);

        if (requestUrl.hostname === hostname) requestUrl.hostname = hostIP;

        const remoteSocket = net.connect(requestUrl.port, requestUrl.hostname, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\r\n' + '\r\n');
            remoteSocket.write(head);
            remoteSocket.pipe(clientSocket);
            clientSocket.pipe(remoteSocket);
        })
            .on('error', function(err){
                console.error(`${hostname} (${dnsHost}) ${err.message}`, err.stack);
                try {
                    clientSocket.end();
                }
                catch (e) {}
            })
    };

    return http.createServer(onRequest)
        .on('connect', onConnect)
        .on('error', function (e) {
            console.error(e);
            console.error(`${hostname} (${dnsHost}) ${err.message}`, err.stack);
        })
        .on('uncaughtException', function(e){
            console.error(e);
            console.error(`${hostname} (${dnsHost}) ${err.message}`, err.stack);
        })
        .listen();
}

module.exports = createProxyServer;