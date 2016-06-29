var bash = require('../index.js');

bash('cp -Rvn ./source/ ./dest')
  .then(function (d) {
    // console.log(d);
  })
  .catch(function (e) {
    //console.log(e);
  })

