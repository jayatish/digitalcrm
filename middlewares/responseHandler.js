'use strict';

module.exports = (req, res, next) => {
  // if (!!res.body || !!Object.keys(res.body.errors).length){
  //   res.response(res.body);
  //   next();
  // } else{
  //   return res.json({
  //       'status': 0,
  //       'message': res.msg,
  //       'data': {}
  //   })
  // }
  return res.json({
      'status': 0,
      'message': res.message,
      'data': {}
  })
    
}