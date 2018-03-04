const express = require('express');

const base = express.Router();

base.get('/', (req, res) => {
    res.render('pages/index');
});

base.get('/invite', (req, res) => {
    res.redirect('https://discordapp.com/oauth2/authorize?client_id=412006490132447249&scope=bot');
});
base.get('/guild', (req, res) => {
    res.redirect('https://discord.gg/fwAxQjV');
});

base.get('/docs', (req, res) => {
    res.render('pages/docs');
});

base.get('/stats', (req, res) => {
    res.render('pages/stats');
});

module.exports = base;