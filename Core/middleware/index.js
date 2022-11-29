const path = require('path');
const fs = require('fs');

let type;
const middleware = {};

//Core MiddleWare
fs.readdirSync(__dirname + '/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
        type = require(path.join(__dirname + '/', file));
        middleware[type.name] = type.function;
    });

// Custom MiddleWare
fs.readdirSync(__dirname + '/../../App/middleware/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
        type = require(path.join(__dirname + '/../../App/middleware/', file));
        middleware[type.name] = type.function;
    });

module.exports = middleware;
