
var time0 = (new Date()).getTime()
var m0 = process.memoryUsage()
var c0 = process.cpuUsage()
var mMAX = process.memoryUsage()
var cMAX = process.cpuUsage()


var diffHandle = function(m0, m1, diffCPU, diffTime){

  var diffJson = {}
  if(diffTime) diffJson.diffTime = diffTime /1000
  diffJson.diffRss = (m1['rss'] - m0['rss']) / 1048576
  diffJson.diffHeapTotal = (m1['heapTotal'] - m0['heapTotal']) / 1048576
  diffJson.diffHeapUsed = (m1['heapUsed'] - m0['heapUsed']) / 1048576
  diffJson.diffExternal = (m1['external'] - m0['external']) / 1048576
  diffJson.diffCpu = (diffCPU.user + diffCPU.system) /1000000

  return diffJson
}

var printDiffJson = function(diffJson){
  if(diffJson.diffTime) 
  console.log('Time       : ', diffJson.diffTime, 's')

  console.log('RAM        : ', diffJson.diffRss, 'mb')
  console.log('HeapTotal  : ', diffJson.diffHeapTotal, 'mb')
  console.log('HeapUsed   : ', diffJson.diffHeapUsed, 'mb')
  console.log('External   : ', diffJson.diffExternal, 'mb')
  console.log('CPU        : ', diffJson.diffCpu, 's')
  console.log('\n')
}


var updateMAX = function(){
  // var rss0 = m0.rss;
  var m1 = process.memoryUsage()
  var c1 = process.cpuUsage()

  for (var key in mMAX) {
    var t0 = mMAX[key]
    var t1 = m1[key]
    mMAX[key] = (t1>t0) ? t1 : t0
  }    

  for (var key in cMAX) {
    var t0 = cMAX[key]
    var t1 = c1[key]
    cMAX[key] = (t1>t0) ? t1 : t0
  }    

}

// process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {

    var printAllTimeHight = function(){
      var diffCPU = process.cpuUsage(c0)
      var diffJson = diffHandle(m0, mMAX, diffCPU)
      console.log('\n *_*_*_* All Time High *_*_*_*') 
      printDiffJson(diffJson)
    }

    // if (options.cleanup){
    //   printMem(mMAX, true)
    // }
    if (err){
      console.log(err.stack);
      printAllTimeHight()
    }
    if (options.exit){
      printAllTimeHight()
      process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


var resourceMonitorMiddleware = function(req, res, next){
    res.locals['time'] = (new Date()).getTime()
    res.locals['mem'] = process.memoryUsage()
    res.locals['cpu'] = process.cpuUsage()
    
    var _startTime = res.locals['time']
    var _m0 = res.locals['mem']
    var _c0 = res.locals['cpu']

    var temp = res.send
    res.send = function() {

        var _m1 = process.memoryUsage()
        var _endTime = (new Date()).getTime()
        var diffCPU = process.cpuUsage(_c0)
        var diffTime = _endTime - _startTime
        
        if(_m1 && _m0) {
          var diffJson = diffHandle(_m0, _m1, diffCPU, diffTime)
          printDiffJson(diffJson)
        //   if(cb) cb(diffJson)
        }


        updateMAX()
        temp.apply(this,arguments);
    }

    updateMAX()
    next()
}

var resourceMonitorMiddlewareCB = function(req, res, next, cb){

    res.locals['time'] = (new Date()).getTime()
    res.locals['mem'] = process.memoryUsage()
    res.locals['cpu'] = process.cpuUsage()
    
    var _startTime = res.locals['time']
    var _m0 = res.locals['mem']
    var _c0 = res.locals['cpu']

    var temp = res.send
    res.send = function() {

        var _m1 = process.memoryUsage()
        var _endTime = (new Date()).getTime()
        var diffCPU = process.cpuUsage(_c0)
        var diffTime = _endTime - _startTime
        
        if(_m1 && _m0) {
          var diffJson = diffHandle(_m0, _m1, diffCPU, diffTime)
          printDiffJson(diffJson)
          if(cb) cb(diffJson)
        }


        updateMAX()
        temp.apply(this,arguments);
    }

    updateMAX()
    next()
}

module.exports = {
    resourceMonitorMiddleware : resourceMonitorMiddleware,
    resourceMonitorMiddlewareCB : resourceMonitorMiddlewareCB
}
