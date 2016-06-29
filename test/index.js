/*eslint-disable*/
var github = require('../index.js');

github
  .delRepo('gitlab')
  .then(function (d) {
    console.log('done->', d);
  })
  .catch(function (e) {
    console.error('catch->', e);
  })

