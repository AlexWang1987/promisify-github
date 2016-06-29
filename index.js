/*eslint-disable*/
var fs = require('promisify-fs');
var Promise = require('bluebird');
var form = require('inquirer').createPromptModule();
var Github = require('github');
var github = new Github({});
/*githubrc_path*/
var githubrc_path = process.env.HOME + '/.githubrc';
var githubrc = null;

/**
 * get github config infomation from ~/.githubrc
 * @return promise
 */
function getGithubRC() {
  if (githubrc) return githubrc;
  return fs
    .fileExists(githubrc_path)
    .then(function (file_stat) {
      if (!file_stat) {
        return syncGithubRC();
      }
    })
    .then(function () {
      return fs
        .readJSON(githubrc_path)
        .then(function (githubrcJson) {
          githubrc = githubrcJson;
        })
    })
}

/**
 * syncGithubRC
 * @return promise
 */
function syncGithubRC() {
  return getCredentials()
    .then(function (credentials) {
      github.authenticate({
        type: "basic",
        username: credentials.username,
        password: credentials.pwd
      })
      return Promise
        .each([
            getGithubUserInfo(),
            getAccessTokenInfo()
          ],
          function (taskResult) {
            return taskResult;
          })
        .spread(function (userInfo, tokenInfo) {
          return fs.writeFile(githubrc_path, {
            userInfo: userInfo,
            tokenInfo: tokenInfo
          });
        })
    })
}

/**
 * getAccessTokenInfo
 * @return promise
 */
function getAccessTokenInfo() {
  return Promise
    .fromCallback(function (cb) {
      github.authorization.create({
        scopes: ['public_repo', 'repo', 'delete_repo'],
        note: 'promisify-github github token'
      }, cb);
    })
}

/**
 * getGithubUserInfo
 * @return promise
 */
function getGithubUserInfo() {
  return Promise
    .fromCallback(function (cb) {
      github.users.get({}, cb);
    })
}

/**
 * getCredentials
 * @return promise
 */
function getCredentials() {
  return form([{
    message: 'Github Username: ',
    type: 'input',
    name: 'username'
  }, {
    message: 'Github Password: ',
    type: 'password',
    name: 'pwd'
  }])
}

/**
 * getAuth2
 * @return promise
 */
function getAuth2() {
  return getGithubRC()
    .then(function () {
      github.authenticate({
        type: "oauth",
        token: githubrc.tokenInfo.token
      });
    })
}

/**
 * newRepo
 * @param  {string} repo_name
 * @param  {string} desc
 * @return promise
 */
function newRepo(repo_name, desc) {
  return getAuth2()
    .then(function () {
      return Promise.fromCallback(function (cb) {
        github.repos.create({
          name: repo_name,
          description: desc
        }, cb)
      })
    })
    .then(function (repoInfo) {
      return repoInfo.ssh_url
    })
}

/**
 * Github apis
 * @param  {string} repo_name
 * @return {promise}
 */
function delRepo(repo_name) {
  return getAuth2()
    .then(function (config) {
      return Promise.fromCallback(function (cb) {
        github.repos.delete({
          user: githubrc.userInfo.login,
          repo: repo_name
        }, cb)
      })
    })
}

module.exports = {
  newRepo: newRepo,
  delRepo: delRepo
}

