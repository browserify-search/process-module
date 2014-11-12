var testModule = require('./test_module')
var getModuleInfo = require('./npm/get_module_info')
var searchInfo = require('./npm/search_info')
var getAuthor = require('./npm/get_author')
var easyFeatures = require('./npm/easy_features')
var browserifiability = require('browserifiability')
var getGithubUrl = require('./npm/get_github_repo')
var getDownloadCount = require('./get_download_count')
var rimraf = require('rimraf')
var extend = require('util')._extend
var path = require('path')
var tmpdir = process.platform === "win32" ? 
    "c:\\windows\\temp\\" : "/tmp/"
var dir = path.join(tmpdir, 'browserify-search')
var path = require('path')
var assert = require('assert')

module.exports = processModule
function processModule(module, done){
  assert(typeof module === 'string')
  assert(typeof done === 'function')

  var timeMeasurements = {}
  var startAll, start, end
  startAll = start = +new Date
  getModuleInfo(module, function(err, info){
    timeMeasurements.moduleInfo = new Date - start
    if (err){
      timeMeasurements.all = new Date - startAll
      return done(null, {
        _id: module,
        invalid: true,
        timeMeasurements: timeMeasurements
      })
    }

    if (!isValid(info)){
      timeMeasurements.all = new Date - startAll
      return done(null, {
        _id: module,
        invalid: true,
        timeMeasurements: timeMeasurements
      })
    }
    var version = info['dist-tags'].latest
    var search = searchInfo(info)
    var features = easyFeatures(info)
    var githubUrl = getGithubUrl(info)
    var githubRepo = {
      owner: githubUrl.split('/')[0],
      name: githubUrl.split('/')[1]
    }
    testModule(module, dir, function(err, results, testTimeMeasurements){
      extend(timeMeasurements, testTimeMeasurements)
      if (err){
        console.error(module, err.message)
        finish()
        return
      }

      var results = {
        _id: module, 
        version: version,
        githubRepo: githubRepo,
        author: getAuthor(info),
        search: search,
        features: features,
        testResults: results,
        timeMeasurements: timeMeasurements
      }

      start = +new Date

      results.browserifiability = browserifiability(results)

      getDownloadCount(module, function(err, downloadInfo){
        if (err){
          results.downloadsLastMonth = {
            error: err.message
          }
        }else{
          results.downloadsLastMonth = {
            start: downloadInfo.start, 
            count: downloadInfo.downloads
          }
        }
        finish()
      })
      
      function finish(){
        start = +new Date
        rimraf(path.join(dir, module), function(){
          timeMeasurements.rimraf = new Date - start
          timeMeasurements.all = new Date - startAll
          done(null, results)
        })
      }
    })
  })
}

function isValid(pkg){
  var tags = pkg['dist-tags']
  if (!tags) return false
  var latest = tags.latest
  if (!latest) return false
  if (!pkg.versions[latest]) return false
  return true
}