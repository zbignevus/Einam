var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    "default": Date.now
  }
});

var openingTimeSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});

var locationSchema = new mongoose.Schema({
  rating: {
    type: Number,
    "default": 0,
    min: 0,
    max: 5,
  },
  name: {
    type: String,
    required: true
  },
  address: String,
  facilities: [String],
  coords: {
  type:[Number],
  index: "2dsphere",
  required: true
  },
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);
/*
db.locations.save({
  name: "Something else",
  address: "Žemaičių g. 26, Vilnius",
  rating: 4,
  facilities: ["Užkandžiai", "Wifi", "Karšti patiekalai"],
  coords: {
  "type": "Point",
  "coordinates": [
  25.295050,
  54.71378
  ]
  },
  openingTimes: [
    {
      days: 'Monday-Friday',
      opening: '9:00am',
      closing: '8:00pm',
      closed: false
    },
    {
      days: 'Saturday',
      opening: '10:00am',
      closng: '6:00pm',
      closed: false
    },
    {
      days: 'Sunday',
      closed: true
    }
  ],
  reviews: {
      author: "Marius Petrauskas",
      _id: ObjectId(),
      rating: 4,
      timestamp: new Date("11 April, 2016"),
      reviewText: "Man netgi patiko labiau negu tikėjausi."
    }
});


db.locations.update({
name: "Jono karšti kebabai",
},{
$push:{
  reviews: {
      author: "Jessica Williams",
      _id: ObjectId(),
      rating: 5,
      timestamp: new Date("16 Jul, 2016"),
      reviewText: "I think this place fulfills it's job well."
    }
  }
})


*/
