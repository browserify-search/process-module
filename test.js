var processModule = require('./index')

processModule('ispy', function(err, results){
  if (err) return console.error(err.message)

  console.log(JSON.stringify(results, null, '  '))
})