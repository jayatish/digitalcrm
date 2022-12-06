'use strict'

var module, exports;
/**
 * { This function loads all the js or module files in a folder }
 *
 * @param      {string}  objectName  The object name (if not provided files will be attached to 
 *                                   `exports` object)
 * @param      {string}  path        Any directory path to index.js file(put ^ for `variable` 
 *                                   directory name) ex:- 'a/b/^/z' where z contains index.js file 
 * @return     {string}  { the auto loader logic in string. Use this with `eval()` function.  }
 *
 */
module.exports = function (objectName, path) {
  var paths = []
  if (objectName && typeof objectName !== 'string') {
    return "console.log('object name is required for autoload function!! please check')";
  }
  if (path && typeof path === 'string') {
    paths = path.split("^");
    paths[1] = paths[1] ? paths[1] : "";

  } else if (path && typeof path !== 'string') {
    return "console.log('path name is required in string format for autoload function!! please check')";
  } else {
    path = [];
    paths[0] = '';
    paths[1] = ''
  }

  var objectName = objectName || 'module.exports'
  return "require('fs').readdirSync(__dirname+'/'+'" + paths[0] + "').forEach(function(file) { if (((/(\.js)$/).test(file)||(/\./).test(file)) && file !== 'index.js') { var name = file.replace('.js', '');" + objectName + "[name] = require(__dirname+'/'+'" + paths[0] + "'+file+'" + paths[1] + "');}})";

}
