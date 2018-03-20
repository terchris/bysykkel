const https = require('https');
const express = require("express");
const app = express();

const options = {
  hostname: 'oslobysykkel.no',
  port: 443,
  headers: {
    'Client-Identifier': '78fed72c6ee33a442b3d3060e095829a'
  }
};

function proxy(path, res) {
  options.path = path || '/api/v1/stations';
  https.get(options, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      console.log(JSON.parse(data));
      res.status(200).json(JSON.parse(data));
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

app.get('/*', function(req, res) {
  console.log('Proxying:' + req.url);
  proxy(req.url, res);
});

app.listen(8880);

