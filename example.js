var express = require('express')
var app = express()

var resourceMonitorMiddleware = require('./index.js').resourceMonitorMiddleware
var resourceMonitorMiddlewareCB = require('./index.js').resourceMonitorMiddlewareCB

// example without callback function
app.use(resourceMonitorMiddleware)


// example with callback function
app.use(function(req, res, next){
  resourceMonitorMiddlewareCB(req, res, next, function(diffJson){
    console.log(' diffJson : ', diffJson)
  })
})


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
