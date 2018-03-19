const express = require('express');

const base = express.Router();

base.get('/', (req, res) => {
    res.render('pages/index');
});

base.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.render('robots');
});

base.get('/invite', (req, res) => {
    res.redirect('https://discordapp.com/oauth2/authorize?client_id=412006490132447249&scope=bot');
});
base.get('/guild', (req, res) => {
    res.redirect('https://discord.gg/fwAxQjV');
});
base.get('/gitlab', (req, res) => {
    res.redirect('https://gitlab.com/dumplings/DMDb');
});
base.get('/impulse', (req, res) => {
    res.redirect('https://discordapp.com/oauth2/authorize?client_id=409327998182096907&permissions=3148800&scope=bot');
});

module.exports = base;