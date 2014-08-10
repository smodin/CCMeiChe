var baidumap = require('../../util/baidumap');

exports.latlng = function(req,res){
  baidumap.geocoder({
    location: [req.params.lat,req.params.lng].join(",")
  },function(err, result){
    if(err){return next();}
    res.status(200).send(result);
  });
}

exports.address = function(req,res){
  baidumap.geocoder({
    address: req.params.address
  },function(err, result){
    if(err){return next();}
    res.status(200).send(result);
  });
}