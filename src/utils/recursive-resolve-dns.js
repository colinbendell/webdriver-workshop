const { Resolver } = require('dns');

const _cache = new Map();
const dns = new Resolver(['8.8.8.8']);

function isIPv6(string) {
    return /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(string || '');
}

function recursiveResolve (host, cb) {
    if (!Array.isArray(host)) host = [host];

    let currentHost = host[host.length-1];

    if (currentHost == null || /^[0-9.]+$/.test(currentHost) || isIPv6(currentHost)) return cb(host);

    if (_cache.has(currentHost)) {
        host = host.concat(_cache.get(currentHost));
        return recursiveResolve(host, cb);
    }

    dns.resolveCname(currentHost,  (err, address) => {
            if (err) {
                dns.resolve(currentHost, (err, address) => {
                    _cache.set(currentHost, err ? [null] : address);
                    host = host.concat(err ? [] : address);
                    cb(host);
                });
            }
            else {
                _cache.set(currentHost, address);
                host = host.concat(address);
                recursiveResolve(host, cb);
            }
        }
    )
}

function resolveChain(hostname) {
    return new Promise(resolve => recursiveResolve(hostname, resolve))
        .then(dnsChain => dnsChain.filter(entry => !!entry && entry!== hostname)); //first entry is self
}

function resolveOne(hostname) {
    return resolveChain(hostname)
        .then(chain => chain.length > 0 ? chain.pop() : '127.0.0.1');
}

module.exports = {
    resolveChain,
    resolveOne
};