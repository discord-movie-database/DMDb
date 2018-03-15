global.config = require('../config.json');

const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    "secret": config.web.session.secret,
    "resave": false,
    "saveUninitialized": true,
    "cookie": {
        "maxAge": 86400000
    }
}));

app.use('*', require('./routes/default.js'));
app.use('/', require('./routes/base.js'));
app.use('/panel', require('./routes/panel.js'));
app.use('*', require('./routes/error.js'));

const listener = app.listen(80, () => {
    console.log(`Listening on port ${listener.address().port}.`);
});