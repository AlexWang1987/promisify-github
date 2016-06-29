#promisify-github

Manipulating resources on Github by promises super easily.


## Usage

```javascript
var github = require('promisify-github');

github
  //.newRepo('gitlab','this is a new repo.')
  .delRepo('gitlab')
  .then(function (d) {
    console.log('done->', d);
  })
  .catch(function (e) {
    console.error('catch->', e);
  })
```

## API

* delRepo

```javascript
/**
 * @param  {string} repo_name
 * @return {promise}
 */
function delRepo(repo_name)
```

* newRepo

```javascript
/**
 * newRepo
 * @param  {string} repo_name
 * @param  {string} desc
 * @return promise
 */
function newRepo(repo_name, desc)
```

