import fetch from 'node-fetch';
import 'dotenv/config';

const url = process.env.URL || 'http://localhost:3001/';

const calls = {
  get: (route, callback) => {
    console.log(`Calling GET on ${url + route}`);
    fetch(url + route)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        callback(json);
      })
      .catch(err => console.error(err));
  }
};

export default calls;
