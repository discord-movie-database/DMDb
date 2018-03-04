const express = require('express');

const error = express.Router();

error.get('*', (req, res) => {
    res.render('pages/404');
});

module.exports = error;