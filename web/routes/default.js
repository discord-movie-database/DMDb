const express = require('express');

const d = express.Router();

d.get('*', (req, res, next) => {
    next();
});

module.exports = d;