/* global require */
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function(request, response) {
    // files that are placed in ext folder
    const files = [
        'highcharts-gantt.js',
        'highstock.js',
        'draggable-points.js',
        'custom-event-dblclick.js',
        'exporting.js'
    ];

    let filePath = '.' + request.url;

    if (filePath === './') {
        filePath = './index.html';
    } else if (filePath.indexOf('?v') >= 0) {
        filePath = filePath.split('?v')[0];
    }

    const isLib = files.filter(f => filePath.indexOf(f) >= 0).length > 0; // check if request file is lib

    if (isLib) {
        filePath = '../../ext/highcharts/' + filePath.replace('./', ''); // if lib change path to ext/highcharts folder
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.js': 'text/javascript'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            response.writeHead(200, {'Content-Type': contentType});
            response.end(content, 'utf-8');
        }
    });
}).listen(8125);

console.log('Server running at http://localhost:8125/');
