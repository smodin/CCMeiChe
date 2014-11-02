var PromoQR = require("../model/promoqr");
var User = require("../model/user");
var Recharge = require("../model/recharge");

module.exports = function(req, res){

  PromoQR.find({
    token: req.query.token
  }).toArray(function(err,results){
    var qr = results[0];
    if(err){
      return next(err);
    }

    function render(err){
      res.render("consume_success",{
        title:"二维码优惠券",
        error: err
      }); 
    }

    if(!qr){
      return render("二维码券不存在");
    }

    if(qr.used){
      return render("二维码已过期");
    }

    Recharge.findById(qr.recharge, function(err, recharge){
      if(err){
        return next(err);
      }
      if(!recharge){
        return render("优惠项目不存在");
      }
        
      User.recharge(req.user._id, {
        credit: recharge.actual_price || 0,
        promo: recharge.promo
      }, function(err){
        if(err){
          return next(err);
        }

        PromoQR.updateById(qr._id, {
          used: true,
          username: req.user.wechat_info ? req.user.wechat_info.nickname : ('no name:' + req.user._id)
        }, function(err){
          if(err){
            return next(err);
          }
          
          render();
        });
      });

    });
  });

}