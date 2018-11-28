const express = require('express');
const app = express();
const axios = require('axios');
const TOKEN = require('./token.js');

const yelpUrl = 'https://api.yelp.com/v3/businesses/search';

const config = {
  headers: { Authorization: 'Bearer ' + TOKEN },
  params: {
    term: 'bulgoki',
    location: 'Oakland'
  }
};

app.get('/', function(req, res) {
  axios.get(yelpUrl, config).then(res => console.log(res.data));
});

app.listen(3001, function() {
  console.log('Express server started on port 3001');
});
