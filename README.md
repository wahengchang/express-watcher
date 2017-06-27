# express-watcher

It is a tool to solve the problem of resolving serise promise functions with parameter continuously. And there is not a solution but only resolving parallelly.

[![NPM](https://nodei.co/npm/express-watcher.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/express-watcher)


## Install

```
$ npm install --save express-watcher
```

## Usage

```js

var resourceMonitorMiddleware = require('express-watcher').resourceMonitorMiddleware

// example without callback function
app.use(resourceMonitorMiddleware)

```


#### Using with Callback
```js

var resourceMonitorMiddlewareCB = require('express-watcher').resourceMonitorMiddlewareCB

// example with callback function
app.use(function(req, res, next){
  resourceMonitorMiddlewareCB(req, res, next, function(diffJson){
    console.log(' diffJson : ', diffJson)
  })
})


// { 
//      diffRss: 0.0078125,
//      diffHeapTotal: 0,
//      diffHeapUsed: 0.012725830078125,
//      diffExternal: 0,
//      diffCpu: 0.000427 
// }
```



## Functionality

#### 1- Monitoring each response 
Return object as a callback:
```
{ diffRss: 0.0078125,
  diffHeapTotal: 0,
  diffHeapUsed: 0.012725830078125,
  diffExternal: 0,
  diffCpu: 0.000427 }
```

And auto print:
![image](https://user-images.githubusercontent.com/5538753/27582174-97f9d326-5b62-11e7-9cd4-862eb4f897cb.png)




#### 2- Monitoring all time high information
All time high information is printed when closing (CRT+c) the node process

And auto print:
![image](https://user-images.githubusercontent.com/5538753/27582293-00daced6-5b63-11e7-8d39-149177159f1d.png)


## Reference
 - [https://www.dynatrace.com/blog/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/](https://www.dynatrace.com/blog/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/)
 - [https://nodejs.org/api/process.html#process_process](https://nodejs.org/api/process.html#process_process)



## License


[MIT](http://vjpr.mit-license.org)