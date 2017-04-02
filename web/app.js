const express = require('express');
const ejs = require('ejs');

// const util = require('../util/main.js');

const app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

let listener = app.listen(80, () => {
    console.log('Listening on port ' + listener.address().port);
});