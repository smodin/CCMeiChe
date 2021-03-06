var vcode = require("../../model").vcode;
var sms = require("../../util/sms");
var logger = require('../../logger');


/**
 * 获取验证码
 * GET
 * phone
 * 返回未失效的验证码
 */
exports.get = function(req,res,next){
  var phone = req.query.phone;
  if(!phone || !phone.match(/^1\d{10}/)){
    return res.send(401,"wrong params");
  }

  vcode.generate(phone, function(err,code){
    if(err){return next(err);}
    if(process.env.NODE_ENV=="product" || process.env.CC_SEND_SMS){
      sms.send(phone,code,function(err,resp,data){
        logger.debug(err,data)
      });
    }
    req.logger.log("系统", "发送验证码", phone + " " + code);
    res.send(200,"ok");
  });
 }