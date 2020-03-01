const chalk = require('chalk');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const { getWeather } = require('./utils');
const PORT = process.env.PORT || 3000;

const app = express();

//Define paths for express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Roy Hadad'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'you must provide an address'
        });
    }
    const searchText = req.query.address;
    getWeather(searchText, (error, { location, summary } = {}) => {
        if (error) {
            res.send({error});
        } else {
            res.send({ location, summary });
        }
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'you must provide a search term'
        });
    } else {
        res.send({
            products: []
        });
    }
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Roy Hadad'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Roy Hadad'
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Roy Hadad',
        error: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Roy Hadad',
        error: 'Page not found'
    });
});

app.listen(PORT, () => {
    console.log(chalk.green(`listening on port ${PORT}...`))
});