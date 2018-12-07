const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const TOKEN = require('./token.js');

const yelpUrl = 'https://api.yelp.com/v3/businesses/search';

const config = {
  headers: { Authorization: 'Bearer ' + TOKEN }
  // params: {
  //   term: 'bulgoki',
  //   location: 'Oakland'
  // }
};

app.use(cors());

app.get('/', function(req, res) {
  const terms = req.query.terms.split(',');
  const location = req.query.location;
  getResults(terms, location).then(collated => {
    // console.log(res);
    res.send(collated);
  });
  // console.log(realData);

  // res.send(getResults(terms, location));
  // const dummyData = {
  //   businesses: [
  //     { name: 'bob', id: 'bobid', url: 'boburl', image_url: 'bobimg' }
  //   ]
  // };
  // console.log(dummyData);
  // console.log(realData);
  // res.send(dummyData);
});

const getResults = async (terms, location) => {
  const results = {};
  await Promise.all(
    terms.map(async term => {
      const config = {
        headers: { Authorization: 'Bearer ' + TOKEN },
        params: {
          term,
          location,
          limit: 5
        }
      };
      const result = await axios.get(yelpUrl, config);
      results[term] = result.data.businesses;
    })
  );

  // get length of longest array of businesses
  const length = Object.values(results).reduce((len, subArr) => {
    return Math.max(len, subArr.length);
  }, 0);

  const collated = {};

  for (let i = 0; i < length; i++) {
    for (let term in results) {
      const currentBiz = results[term][i];
      if (typeof currentBiz !== 'undefined') {
        const id = currentBiz['id'];
        if (typeof collated[id] === 'undefined') collated[id] = currentBiz;
      }
    }
  }

  // for (let id in collated) {
  //   console.log(collated[id]['name']);
  // }
  return collated;
};

app.listen(3001, function() {
  console.log('Express server started on port 3001');
});
