const db = require('../../handlers/db.js');

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
    // Filter guilds.
    req.session.guilds = {};
    for (let i = 0; i < guilds.length; i++) {
        // Check if owner.
        if (!guilds[i].owner) continue;

        // Get guild from database.
        const guildDB = await db.getGuild(guilds[i].id).catch((err) => console.log(err));
        // Get if guild is in database.
        if (!guildDB) continue;

        // Merge user guild and guild database information.
        guilds[i] = {...guilds[i], ...guildDB};

        // Add guild to session.
        req.session.guilds[guilds[i].id] = guilds[i];
    }

    // Logged in.
    req.session.authenticated = true;

    // Back to panel.
    res.redirect('/panel');
});

panel.get('/logout', (req, res) => {
    // Delete session.
    req.session.authenticated = false;
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

panel.post('/guild/:id/update', async (req, res) => {
    // Check if logged in.
    if (!req.session.authenticated) return res.json({error: 'Not logged in.'});
    // Check if guild is in session.
    if (!req.session.guilds[req.params.id]) return res.json({error: 'Guild not in session.'});

    // *-- PREFIX --*
    //
    // Check if there's a prefix query.
    if (!req.body.prefix) return res.json({error: 'Prefix required.'});
    // Check if prefix is the same as current.
    if (req.body.prefix === req.session.guilds[req.params.id].prefix) return res.json({error: 'New prefix same as current.'});
    // Check if prefix is valid.
    if (!/^[a-z0-9!"£$%^&*()_+=-\[\];'#:@~<>?\/.,\\`¬]{1,30}$/i.test(req.body.prefix)) return res.json({error: 'Invalid prefix. Must be 1-30 characters long and only contain a-z 0-9 !"£$%^&*()_+=-[];\'#:@~<>?/.,\`¬'});
    // Update prefix.
    req.body.prefix = req.body.prefix.trim();

    // Update database.
    const guildUpdateDB = await db.updateGuild(req.params.id, {
        prefix: req.body.prefix
    }).catch((err) => console.error(err));
    // Check if update was successful.
    if (!guildUpdateDB || guildUpdateDB.skipped) return res.json({error: 'Cannot update this guild.'});

    // Update session settings.
    req.session.guilds[req.params.id].prefix = req.body.prefix;

    // Success.
    return res.json({success: true});
});

module.exports = panel;