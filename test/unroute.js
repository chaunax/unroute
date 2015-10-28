var expect = require('chai').expect;
var express = require('express');
var fetch = require('isomorphic-fetch');
var unroute = require('../unroute');

var app = express();
var router = express.Router();
var port = 3333;
var rootPath = 'http://localhost:' + port + '/';

describe('unroute', () => {
  var server;

  before (done => {

    addTestRoute(router, '1');
    addTestRoute(router, '2');
    addTestRoute(router, '3');
    addTestRoute(router, '4');
    router.get('/api/test5', (req, res) => {
      res.json('GET5');
    });

    app.use('/', router);

    server = app.listen(port, (err, result) => {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  after(done => {
    server.close();
    done();
  });

  it('is initialized with exposed endpoints', done => {
    Promise.all([
      testOk(1, 'GET'),
      testOk(2, 'GET'),
      testOk(3, 'GET'),
      testOk(4, 'GET'),
      testOk(5, 'GET'),
      testOk(1, 'DELETE'),
      testOk(2, 'DELETE'),
      testOk(3, 'DELETE'),
      testOk(4, 'DELETE')
    ])
    .then(vals => {
      done();
    })
    .catch(done);
  });

  it('removes a route completely', done => {
    unroute.remove(router, '/api/test1');

    Promise.all([
      testFail(1, 'GET'),
      testFail(1, 'DELETE')
    ])
    .then(vals => {
      done();
    })
    .catch(done);

  });

  it('removes a route by path', done => {
    unroute.remove(router, '/api/test2', ['delete']);

    Promise.all([
      testOk(2, 'GET'),
      testFail(2, 'DELETE')
    ])
    .then(vals => {
      done();
    })
    .catch(done);

  });

  it('doesn\'t fail if requesting removal of nonexistant path', done => {
    unroute.remove(router, '/api/test3', ['PUT']);

    Promise.all([
      testOk(3, 'GET'),
      testOk(3, 'DELETE')
    ])
    .then(vals => {
      done();
    })
    .catch(done);

  });

  it('removes entire route if all methods are removed', done => {
    unroute.remove(router, '/api/test4', ['GET', 'delete']);

    Promise.all([
      testFail(4, 'GET'),
      testFail(4, 'DELETE')
    ])
    .then(vals => {
      var matching = router.stack.filter(function(obj){
        return obj.route.path == '/api/test4';
      });
      expect(matching.length).to.equal(0);
      done();
    })
    .catch(done);

  });


  it('works with direct route setting', done => {
    unroute.remove(router, '/api/test5', ['GET']);

    Promise.all([
      testFail(5, 'GET'),
    ])
    .then(vals => {
      done();
    })
    .catch(done);

  });
});

function addTestRoute(router, pathId){
  router.route('/api/test' + pathId)
    .get((req, res) => { res.json('GET' + pathId); })
    .delete((req, res) => { res.json('DELETE' + pathId); });
}

function testOk(pathId, method){
  return fetch(rootPath + 'api/test' + pathId, { method: method })
  .then(res => {return res.json();})
  .then(val => {
    expect(val).to.equal(method + pathId);
    return true;
  });
}

function testFail(pathId, method){
  return fetch(rootPath + 'api/test' + pathId, { method: method })
  .then(res => {
    expect(res.status).to.equal(404);
    return true;
  });
}
