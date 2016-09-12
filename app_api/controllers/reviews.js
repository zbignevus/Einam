var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.reviewsCreate = function(req,res){
  getAuthor(req, res, function(req, res, userName){
    if(req.params.locationid){
      Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(function(err, location){
          if(err){
            sendJsonResponse(res, 400, err);
          } else {
            doAddReview(req, res, location, userName);
          }
        });
      } else {
        sendJsonResponse(res, 404, {"message": "Not found, locationid parameter is required"});
      }
  });
};
var getAuthor = function(req, res, callback){
  console.log("Finding author with email " + req.payload.email);
  if(req.payload && req.payload.email){
    User
        .findOne({ email: req.payload.email})
        .exec(function(err, user){
          if(!user){
            sendJsonResponse(res, 404, {"message": "User not found"});
            return;
          } else if (err) {
            console.log(err);
            sendJsonResponse(res, 404, err);
            return;
          }
          callback(req, res, user.name);
        });
  } else {
    sendJsonResponse(res, 404, {"message": "User not found"});
    return;
  }
};

      var doAddReview = function(req, res, location, author){
          if(!location){
            sendJsonResponse(res, 404, {"message": "Location with that id not found"});
          } else{
            location.reviews.push({
              author: author,
              rating: req.body.rating,
              reviewText: req.body.reviewText
            });
            location.save(function(err, location){
              var thisReview;
              if(err){
                sendJsonResponse(res, 400, err);
              } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
              };
            });
          };
      };

      var updateAverageRating = function(locationid){
        Loc
          .findById(locationid)
          .select('rating reviews')
          .exec(function(err, location){
            if(!err){
              setAverageRating(location);
            }
          });
      };

      var setAverageRating = function(location){
        if(location.reviews && location.reviews.length > 0){
          var i, reviewCount, ratingTotal, ratingAverage;
          reviewCount = location.reviews.length;
          ratingTotal = 0;
          for(i = 0; i<reviewCount; i++){
            ratingTotal = ratingTotal + location.reviews[i].rating;
          };
          ratingAverage = parseInt(ratingTotal / reviewCount, 10);
          console.log("average rating has been updated to :" + ratingAverage);
        };
      };



module.exports.reviewsReadOne = function(req,res){
  if(req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(function(err, location){
        var response, review;
        if(!location){
          sendJsonResponse(res, 404, {"message": "location with that id not found"});
          return;
        } else if(err){
          sendJsonResponse(res, 400, err);
          return;
        };
        if(location.reviews && location.reviews.length > 0){
          review = location.reviews.id(req.params.reviewid);
          if(!review){
            sendJsonResponse(res, 400, {"message": "review with that id not found"});
            return;
          } else {
            response = {
              location: {
                name: location.name,
                id: req.params.locationid
              },
              review: review
            };
            sendJsonResponse(res, 200, response);
          };
        } else {
          sendJsonResponse(res, 400, {"message": "No reviews found"});
        }

      });
  } else {
    sendJsonResponse(res, 400, {"message": "Both locationid and reviewid parameters are required"});
  }
};


module.exports.reviewsUpdateOne = function(req,res){
  if(!req.params.locationid || !req.params.reviewid){
    sendJsonResponse(res, 404, {"message": "locationid and reviewid parameters are required"});
    return;
  };
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(function(err, location){
      var thisReview;
      if(!location){
        sendJsonResponse(res, 404, {"message": "location with that id not found"});
        return;
      } else if(err){
        sendJsonResponse(res, 400, err);
        return;
      };
      if(location.reviews && location.reviews.length > 0){
        thisReview = location.reviews.id(req.params.reviewid);
        if(!thisReview){
          sendJsonResponse(res, 404, {"message": "review with that id not found"});
        } else{
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(function(err, location){
            if(err){
              sendJsonResponse(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJsonResponse(res, 200, location);
            };
          });

        };

      } else {
        sendJsonResponse(res, 404, {"message": "no reviews for that location found."});
      }
    });
};
module.exports.reviewsDeleteOne = function(req,res){
  if(!req.params.locationid || req.params.reviewid){
      sendJsonResponse(res, 404, {"message": "locationid and reviewid parameters are required."});
      return;
  };
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(function(err, location){
      if(!location){
          sendJsonResponse(res, 404, {"message": "no location with that id found"});
          return;
      } else if(err){
        sendJsonResponse(res, 400, err);
        return;
      }
      if(location.reviews && location.reviews.length > 0){
        if(!location.reviews.id(req.params.reviewid)){
          sendJsonResponse(res, 404, {"message": "review with that id does not exist"});
          return;
        } else {
          location.reviews.id(req.params.reviewid).remove()
          location.save(function(err){
            if(err){
              sendJsonResponse(res, 404, err);
            }
            updateAverageRating(location._id);
            sendJsonResponse(res, 204, null);
          });


        };
      } else{
        sendJsonResponse(res, 404, {"message": "No reviews to delete"});
        return;
      }
    });

};
