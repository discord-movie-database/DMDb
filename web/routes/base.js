const express = require('express');

const base = express.Router();

base.get('/', (req, res) => {
    res.render('pages/index');
});

base.get('/dbots', (req, res) => {
    res.render('pages/dbots');
});

base.get('/robots.txt', (req, res) => {
    res.send('test');
});

base.get('/invite', (req, res) => {
    res.redirect('https://discordapp.com/oauth2/authorize?client_id=412006490132447249&scope=bot');
});
base.get('/guild', (req, res) => {
    res.redirect('https://discord.gg/fwAxQjV');
});
base.get('/github', (req, res) => {
    res.redirect('https://github.com/dumplingsr/IMDb');
});
base.get('/impulse', (req, res) => {
    res.redirect('https://discordapp.com/oauth2/authorize?client_id=409327998182096907&permissions=3148800&scope=bot');
});

module.exports = base;