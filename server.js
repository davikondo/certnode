var express = require('express');
var btoa = require('btoa');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
var https = require('https');
var fs = require('fs');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

var opts = {
	key: fs.readFileSync('./certs/server_key.pem'),
	cert: fs.readFileSync('./certs/server_cert.pem'),
	ca: [fs.readFileSync('./certs/server_ca.pem')],
	requestCert: true,
	rejectUnauthorized: false,
	agent: false
};

app.get('/certificate', function (req, res) {
	var cert = req.connection.getPeerCertificate(true);
	console.log(cert)

	if (cert.pubkey) {
		res.send({pubkey: arrayBufferToBase64(cert.pubkey)});
	} else {
		res.status(401).send('Certificado ausente.');
	}
});

https.globalAgent.options.maxCachedSessions = 0;
https.createServer(opts, app).listen(9999);


function arrayBufferToBase64(buffer) {
	var binary = '';
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}
