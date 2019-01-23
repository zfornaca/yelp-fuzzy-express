const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const TOKEN = require('./token.js');

const yelpUrl = 'https://api.yelp.com/v3/businesses/search';

const config = {
  headers: { Authorization: 'Bearer ' + TOKEN }
};

app.use(cors());

app.get('/', function(req, res) {
  const terms = req.query.terms.split(',');
  const location = req.query.location;

  console.log(terms);

  Promise.all(
    terms.map(term => {
      const config = {
        headers: { Authorization: 'Bearer ' + TOKEN },
        params: {
          term,
          location: location || 'Oakland',
          limit: 10
        }
      };
      return axios.get(yelpUrl, config);
    })
  )
    .then(results => {
      // console.log('Zezults: ', results[0].request);

      const collated = collateData(results);
      res.send(collated);
    })
    .catch(error => console.log('Zerror: ', error));
});

function collateData(results) {
  // get length of longest array of businesses
  const length = results.reduce((len, result) => {
    return Math.max(len, result.data.businesses.length);
  }, 0);

  const collated = {};

  // for each business in each search result, add it to collated results
  // if not already present, with the Yelp business ID as the key. Add a
  // 'terms' key to each business with an array of all terms that had that
  // business among the results.
  for (let i = 0; i < length; i++) {
    for (let result in results) {
      const currentBiz = results[result].data.businesses[i];
      if (typeof currentBiz !== 'undefined') {
        const id = currentBiz['id'];
        console.log(results[result].config.params.term);
        if (typeof collated[id] === 'undefined') {
          collated[id] = currentBiz;
          collated[id].terms = [results[result].config.params.term];
        } else {
          collated[id].terms.push(results[result].config.params.term);
        }
      }
    }
  }
  console.log(collated);
  return collated;
}

app.listen(3001, function() {
  console.log('Express server started on port 3001');
});
