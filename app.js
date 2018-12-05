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
  const realData = getResults(terms, location);
  const collated = new Map();
  let length = realData.reduce(function(length, elem) {
    return Math.max(length, elem.length);
  }, 0);
  for (let i = 0; i < length; i++) {
    // for each subarray, process subarray[i]
    // processing rules:
    // if subarray[i] is undefined, do nothing
    // if Map already has id as key, do nothing
    // if Map does not already have key, add:
    // id: {name, url, image_url}
  }

  // res.send(getResults(terms, location));
  const dummyData = {
    businesses: [
      { name: 'bob', id: 'bobid', url: 'boburl', image_url: 'bobimg' }
    ]
  };
  // console.log(dummyData);
  // console.log(realData);
  res.send(dummyData);
});

const getResults = async (terms, location) => {
  const results = {};
  await Promise.all(
    terms.map(async term => {
      const config = {
        headers: { Authorization: 'Bearer ' + TOKEN },
        params: {
          term,
          location
        }
      };
      const result = await axios.get(yelpUrl, config);
      // console.log(result);
      results[term] = result.data.businesses;
    })
  );
  console.log(results);
  // let results = await axios.get([axios.get(yelpUrl)]);
};

// app.get('/', function(req, res) {
//   let promises = [];
//   let allRes = {};
//   for (let term in req.query.terms.split(',')) {
//     const params = {
//       term,
//       location: req.query.location
//     };
//     config.params = params;
//     promises.push(
//       axios.get(yelpUrl, config).then(oneRes => {
//         allRes.term = oneRes.data;
//       })
//     );
//   }
//   console.log(promises);
//   axios.all(promises).then(console.log(allRes));
// });

////////////////

// how to send multiple axios requests
//   config.params = params;
//   axios.get(yelpUrl, config).then(yres => {
//     console.log(yres.data.total);
//     res.send(yres.data);
//   });
// });

app.listen(3001, function() {
  console.log('Express server started on port 3001');
});
