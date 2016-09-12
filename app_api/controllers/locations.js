var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.locationsListByDistance = function(req, res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);

  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: maxDistance,
    num: 5
  };
  if((!lng && lng!==0) || (!lat && lat!==0) || (!maxDistance && maxDistance!==0)){
    console.log("error, need all parameters");
    sendJsonResponse(res, 400, {"message": "lng, lat and maxDistance parameters required"});
    return;
  };

  Loc.geoNear(point, geoOptions, function(err, results, stats){
    var locations;
    if(err){
      sendJsonResponse(res, 400, err);
    } else {
      locations = buildLocationList(req, res, results, stats);
      sendJsonResponse(res, 200, locations);
    };
  });

  var buildLocationList = function(req, res, results, stats){
    var locations = [];
    results.forEach(function(doc){
      locations.push({
        distance: doc.dis,
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      })
    });
    return locations;
  };

};

/*
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);


  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: maxDistance,
    num: 5
  };
    if (!lng || !lat || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJsonResponse(res, 404, {"message": "lng, lat and maxD query parameters are all required"});
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, results, stats) {
    var locations;
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      locations = buildLocationList(req, res, results, stats);
      sendJsonResponse(res, 200, locations);
    }
  });

};


var buildLocationList = function(req, res, results, stats) {
  var locations = [];
  results.forEach(function(doc) {
    locations.push({
      distance: doc.dis,
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
};
*/
module.exports.locationsReadOne = function(req, res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location){
        if(!location){
          sendJsonResponse(res, 404, {"message": "location with that id not found."});
          return;
        }
        else if(err){
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, location);
      });
  } else {
    sendJsonResponse(res, 404, {"message": "locationid parameter is required"});
  }
};

module.exports.locationsCreate = function(req,res){
  Loc.create(
    {
      name: req.body.name,
      address: req.body.address,
      rating: req.body.rating,
      coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      facilities: req.body.facilities.split(','),
      openingTimes:
      [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
        },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }]
    },
    function(err, location){
      if(err){
        sendJsonResponse(res, 400, err);
      } else{
        sendJsonResponse(res, 200, location);
      }
    }
  );
};

module.exports.locationsDeleteOne = function(req,res){
  var locaitonid = req.params.locationid;
  if(locationid){
    Loc
      .findByIdAndRemove(locationid)
      .exec(function(err, location){
        if(err){
          sendJsonResponse(res, 404, err);
          return;
        }
          sendJsonResponse(res, 204, null);
      });

  } else {
    sendJsonResponse(res, 404, {"message": "no locationid provided"});
  };
};
module.exports.locationsUpdateOne = function(req,res){
  if(!req.params.locationid){
    sendJsonResponse(res, 404, {"message": "locationid parameter is missing in request"});
    return;
  };
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(function(err, location){
      if(!location){
        sendJsonResponse(res, 404, {"message": "location with that id not found"});
        return;
      } else if(err){
        sendJsonResponse(res, 400, err);
        return;
      };
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities  = req.body.facilities.split(',');
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
      },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }];

      location.save(function(err, location){
        if(err){
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, location);
        }
      });
    });
};


//localhost:3000/api/locations?lng=25.280858&lat=54.683216&maxDistance=600000
//localhost:3000/api/locations/57a8874db1017eb9731e8795


// lng 24.938195, // lat 54.638284
// lng 25.2838 // lat 54.686557
/*

//lng 25.280858 // lat 54.683216

db.locations.save({
"name" : "Tūkstantis kibinų",
"address" : "Liejyklos g. 3, Vilnius",
"rating" : 4,
"facilities" : [
        "Kibinai",
        "Wifi",
        "Staliukai"
],
"coords" : [25.280858, 54.683216],
"openingTimes" : [
        {
                "days" : "Monday-Friday",
                "opening" : "7:00am",
                "closing" : "8:00pm",
                "closed" : false
        },
        {
                "days" : "Saturday",
                "opening" : "9:00am",
                "closng" : "6:00pm",
                "closed" : false
        },
        {
                "days" : "Sunday",
                "closed" : true
        }
]
})


db.locations.update({
name: 'Tūkstantis kibinų'
}, {
$push: {
reviews: {
author: 'Karolis Karaliauskas',
_id: ObjectId(),
rating: 5,
timestamp: new Date("Jun 5, 2016"),
reviewText: "Buvo skanu, man patiko. Viskas veikia."
}
}
})
*/
