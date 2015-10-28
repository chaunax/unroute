module.exports = {

/**
 * Remove route matching path/method
 * @param  {Express.Router} router
 * @param  {string} path
 * @param  {array} methods - e.g., ['GET', 'PUT']. Defaults to all methods if null.
 */
  remove: function(router, path, methods){
    if(!methods) {
      methods = [];
    }
    methods = methods.map(function(obj){
      return obj.toUpperCase();
    });

    router.stack.forEach(function(route, i, routes) {
      if(route.route.path == path){
        if(methods.length === 0){
          //remove all paths
          routes.splice(i, 1);
        } else {
          var arr = route.route.stack;
          //remove matching paths
          for (j = arr.length - 1; j >= 0; j -= 1) {
            if(methods.indexOf(arr[j].method.toUpperCase()) > -1){
              arr.splice(j, 1);
            }
          }
          //if all methods are now gone, remove route completely
          if(route.route.stack.length === 0){
            routes.splice(i, 1);
          }
        }
      }
    });
  }

};
