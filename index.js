
const jm = require('js-meter')


const isPrint = true
const isMs = true       // or Second 
const isKb = true       // or Mb 
const MAX = {}

const printAllTimeHigh = (MAX) => {  
  var mUnit = (isKb) ? 'kb' : 'mb'
  var tUnit = (isMs) ? 'ms' : 's'
  console.log('\n *_*_*_* All Time High *_*_*_*') 
  console.log('RAM        : ', MAX.diffRAM , mUnit)
  console.log('HeapTotal  : ', MAX.diffHeapTotal , mUnit)
  console.log('HeapUsed   : ', MAX.diffHeapUsed , mUnit)
  console.log('External   : ', MAX.diffExternal , mUnit)
  console.log('CPU        : ', MAX.diffCPU, tUnit)
  console.log('Spend time : ', MAX.diffTime, tUnit)
}

function exitHandler(options, err) {

    // if (options.cleanup){
    //   printMem(mMAX, true)
    // }
    if (err){
      printAllTimeHigh(MAX)
      console.log(err.stack);
    }
    if (options.exit){
      printAllTimeHigh(MAX)
      process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


var checkMax = (meter) => {
  for (var key in meter) {
    if(!MAX[key]) 
      MAX[key] = meter[key]
    else if(meter[key] > MAX[key]) 
      MAX[key] = meter[key]
  }    
}


var resourceMonitorMiddleware = function(req, res, next){
    const m = new jm({isPrint, isMs, isKb})
    const temp = res.send    
    res.send = function() {
        console.log(`*_*_*_*_*_* ${req.url}`)
        const meter = m.stop()

        checkMax(meter)
        temp.apply(this,arguments);
    }
    next()
}

var resourceMonitorMiddlewareCB = function(req, res, next, cb){

  const m = new jm({isPrint, isMs, isKb})
  
    const temp = res.send    
    res.send = function() {
        console.log(`*_*_*_*_*_* ${req.url}`)
        const meter = m.stop()

        if(cb) cb(meter)          
        checkMax(meter)
        temp.apply(this,arguments);
    }
    next()
}

module.exports = {
    resourceMonitorMiddleware : resourceMonitorMiddleware,
    resourceMonitorMiddlewareCB : resourceMonitorMiddlewareCB
}
