const express = require('express');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.use('*', require('./routes/default.js'));
app.use('/', require('./routes/base.js'));
app.use('/api', require('./routes/api.js'));
app.use('*', require('./routes/error.js'));

const listener = app.listen(80, () => {
    console.log(`Listening on port ${listener.address().port}.`);
});