const express = require('express'),
    app = express(),
    path = require('path'),
    bp = require('body-parser'),
    port = 8000;

app.use(express.static(path.join(__dirname + '/client')));

app.use(express.static(path.join(__dirname + '/bower_components')));

app.use(bp.json());

app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})
