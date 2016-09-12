var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = "https://normalname1.herokuapp.com";
};

// revise parseInt & parseFloat
var _formatDistance = function(){
  return function(distance){
    var unit, numDistance;
    if(distance>1000){
      numDistance = parseFloat(parseInt(distance) / 1000).toFixed(1);
      unit = ' km';
    } else {
      numDistance = parseInt(distance);
      unit = ' m';
    };
    return numDistance + unit;
  };
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};


var renderHomepage = function(req, res){
  res.render('locations-list', {
    title: "Einam - einam i miesta",
    pageHeader:{
      title: "Einam",
      strapline: "Geriausios vietos laisvalaikiui!"
    },
    sidebar: "Ieškote kur praleist laisvalaikį? Šiame puslapyje rasite geriausius pasiūlymus!"
  });
};


module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: 25.276937,
      lat: 54.697636,
      maxDistance: 5000
    }
  };
  request(requestOptions, function(err, response, body){
    var i, data;
    data = body;
    if(response.statusCode === 200 && data.length){
      for(i=0;i<data.length;i++){
        data[i].distance = _formatDistance(data[i].distance);
      };
    };
    renderHomepage(req, res, data);
  });
};




var renderDetailPage = function(req, res, locDetail){
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: "yra Einam saraše, nęs tūri gerą wifi interneto ryšį.",
      callToAction: "Jeigu ten užsukot, nepamirškit parašyti komentarą."
    },
    location: locDetail
  });
};

var getLocationInfo = function(req, res, callback){
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json:{}
  };
  request(requestOptions, function(err, response, body){
    var data = body;
    if(response.statusCode === 200){
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
     callback(req, res, data);
   } else {
     _showError(req, res, response.statusCode);
   };
  });

};

module.exports.locationInfo = function(req,res){
  getLocationInfo(req, res, function(req, res, responseData){
    renderDetailPage(req, res, responseData);
  });
};

var renderReviewForm = function(req, res, locDetail){
  res.render('location-review-form', {
    title: "Palik Einam Atsiliepimą apie " + locDetail.name,
    pageHeader: {
      title: "Atsiliepk apie " + locDetail.name
    },
    error: req.query.err,
    url: req.originalUrl
  });
};

module.exports.addReview = function(req,res){
  getLocationInfo(req, res, function(req, res, responseData){
    renderReviewForm(req, res, responseData);
  });
};

module.exports.doAddReview = function(req, res){
  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  path = "/api/locations/" + locationid + "/reviews";
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  };
  if(!postdata.author || !postdata.rating || !postdata.reviewText){
    res.redirect("/location/" + locationid + "/reviews/new?err=val");
  } else {
    request(requestOptions, function(err, response, body){
      if(response.statusCode === 201){
        res.redirect('/location/' + locationid);
      } else if(response.statusCode === 400 && body.name && body.name === "ValidationError"){
        res.redirect('/location/' + locationid + "/reviews/new?err=val");
      } else {
        _showError(req, res, response.statusCode);
      };
    });
  };
};
