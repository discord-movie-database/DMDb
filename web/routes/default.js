const express = require('express');
const ip = require('ip');

const d = express.Router();

d.get('*', (req, res, next) => {
    const host = req.get('host');
    const server = ip.address();

    if (host === server)
        return res.status(403).send('Access Denied');

    next();
});

module.exports = d;