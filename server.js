
// requires for node modules
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

// use statements for modules
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(bodyParser.json());

// route for homepage
app.get('/', function(req,res){
  res.sendFile('./public/html/index.html', {root: './'});
});

// route for api query
app.post('/search', function(req, res){
  request({
    url:`https://api.nasa.gov/neo/rest/v1/feed?start_date=${req.body.startdate}&end_date=${req.body.enddate}&api_key=tgXqo18P9Dt2gGW7z6zL3q5znCIEPl2JVpGCbcin`,
  }, function (error, response, body) {
    if (error || (response.statusCode !== 200)) {
      console.log("Failed send request");
      res.send("You done messed up AAron")
    }
    else {
      var asteroidsToSend = [];
      function Asteroid(name, size, velocity) {
        this.name = name;
        this.size = size;
        this.velocity = velocity;
      }
      var bodyAsObject = JSON.parse(body)
      var nearEarthObject = bodyAsObject['near_earth_objects']
      // // loop through returned data to get information for individual asteroids
        for (var date in nearEarthObject) {
          var eachDate = nearEarthObject[date];
            for (var meteors in eachDate) {
              var individualMeteor = eachDate[meteors];
                if (individualMeteor['is_potentially_hazardous_asteroid']) {
                  console.log("inner")
                  // push desired attributes to new arrays
                  var asteroidName = individualMeteor['name'];
                  var asteroidSize = individualMeteor['estimated_diameter']['feet']['estimated_diameter_max']
                  var asteroidVelocity = individualMeteor['close_approach_data'][0]['relative_velocity']['miles_per_hour']
                  var newAsteroid = new Asteroid(asteroidName, asteroidSize, asteroidVelocity)
                  asteroidsToSend.push(newAsteroid)

                }
            }
        }





        var stringToSend = JSON.stringify(asteroidsToSend)
      // var bodyObj = JSON.parse(body)
      // res.send({result: bodyAsObject[req.body]})
      console.log(stringToSend)
      res.send(stringToSend)

    }
  })
})






// port listener
app.listen(8080, function(){
  console.log("port open on 8080")
})
