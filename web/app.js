const express = require('express');
const ejs = require('ejs');

// const handlers = require('../handlers/index.js');

const app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

const listener = app.listen(80, () => {
    console.log(`Listening on port ${listener.address().port}.`);
});