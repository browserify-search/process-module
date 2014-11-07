process-module
==============

Process a module on npm, including getting/interpreting metadata, testing, and fetching popularity data.

## Install

`npm install brsh-process-module`

## Example

```js
var processModule = require('brsh-process-module')

processModule('ispy', function(err, results){
  if (err) return console.error(err.message)

  console.log(results)
})
```

Output:

```
{ _id: 'ispy',
  version: '0.1.2',
  search: 
   { name: 'ispy',
     description: 'A simple spy.',
     keywords: 'testing, spy',
     readme: 'ERROR: No README.md file found!' },
  features: 
   { hasTestling: false,
     hasBrowserKeyword: false,
     hasBrowserifyField: false,
     hasBrowserField: false,
     hasBrowserInDescription: false,
     hasBrowserInReadme: false,
     hasPluginInDescription: false,
     hasPluginInReadme: false,
     hasGruntInName: false,
     hasGruntInDescription: false,
     hasGruntInReadme: false,
     hasExpressInName: false,
     hasExpressInDescription: false,
     hasExpressInReadme: false },
  testResults: 
   { install: { passed: false, error: '' },
     browserify: { bundle: {}, test: {} },
     coreDeps: null },
  timeMeasurements: 
   { moduleInfo: 56,
     testModule: 6,
     install: 6,
     browserifiability: 0,
     rimraf: 1,
     all: 204 },
  browserifiability: 0,
  downloadsLastMonth: { start: '2014-10-04', count: 183 } }
```