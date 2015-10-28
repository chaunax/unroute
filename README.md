# Unroute

Unroute unregisters endpoints in Express Routers, identifying them via
their path and method signature.


## Usage
Install via npm:
```
npm install unroute --save
```



```javascript
//If your route is set up for a delete endpoint on /api/test1:
var express = require('express');
var app = express();
var router = express.Router;
router.route('/api/test1')
  .delete((req, res) => { res.json('DELETE'); });

...

//...you can use Unroute to remove that route specifically:
var unroute = require('unroute');
unroute.remove(router, '/api/test1', ['delete']);

//or leave out the methods param to remove entire route:
unroute.remove(router, '/api/test1');


```


## remove(router, path, methods)
 * @param  {Express.Router} router
 * @param  {string} path
 * @param  {array} methods - e.g., ['GET', 'PUT']. Defaults to all methods if null.



## Tests
Tests are written in mocha/chai.expect.
