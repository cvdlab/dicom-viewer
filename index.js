const path = require('path');
const express = require('express');

var dicom_loader = require('./dicom_loader.js');

const app = express();

const APP_PORT = 3000;
const API_VERSION = '0';
const API_ROOT = path.join('/api', API_VERSION);

app.use(express.static('public'));

/**
 * GET /api/0/dicom/:name/:coord/:slice
 */

app.get(path.join(API_ROOT, 'dicom/:name/:coord/:slice'), function (req, res) {
    let name = req.params.name;
    let coord = req.params.coord;
    let slice = req.params.slice;
    //dicomLoad.dicom_map[slice].pipe(res);
    dicom_loader.get_DICOM_image(slice)
        .then(function (buffer) {
            res.writeHead(200, {
                'Content-Length': buffer.length,
                'Content-Type': 'image/png'
            });
            res.end(buffer);

        })
        .catch(function (error) {
            console.log("ERROR retrieving image slice:" + slice)
            console.log(error)
        })
   // res.send(`slice ${name} ${coord} ${slice}`)
})

app.listen(APP_PORT, function () {
    console.log(`Server listening on port ${APP_PORT}!`)
})