const express = require('express');
const superagent = require('superagent');

const panel = express.Router();

panel.get('/login', async (req, res) => {
    // Check if already logged in.
    if (req.session.authenticated) return res.redirect('/panel');
    // Check if there is a authorization code.
    if (!req.query.code) return res.redirect(`${config.web.authorizeUri}?client_id=${config.clientId}&scope=identify%20guilds&redirect_uri=${config.web.redirectUri}&response_type=code`);

    // Get access token from code.
    const { body: token } = await superagent.post(`${config.web.tokenUri}?client_id=${config.clientId}&client_secret=${config.clientSecret}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=${config.web.redirectUri}`);
    req.session.token = `${token.token_type} ${token.access_token}`;

    // Get user information.
    const { body: user } = await superagent.get(config.web.userUri).set('Authorization', req.session.token);
    req.session.user = user;

    // Get user guild information.
    const { body: guilds } = await superagent.get(config.web.guildsUri).set('Authorization', req.session.token);
    req.session.guilds = guilds.filter((guild) => guild.owner);

    // Check if user has permission in a guild to edit the bot.
    if (req.session.guilds.length === 0) return res.redirect('/invite');

    // Logged in.
    req.session.authenticated = true;

    // Back to panel.
    res.redirect('/panel');
});

panel.get('/logout', (req, res) => {
    // Delete session.
    req.session.destroy();

    // Redirect back to home.
    res.redirect('/');
});

panel.get('/', (req, res) => {
    // Check if user is logged in to access panel. Login if not.
    if (!req.session.authenticated) return res.redirect('/panel/login');

    // Render the panel.
    res.render('pages/panel', {
        page: 'panel',
        session: req.session
    });
});

panel.post('/guild/:id/update', (req, res) => {

});

module.exports = panel;