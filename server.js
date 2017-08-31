// where node app starts
var mongodb = require('mongodb');
var express = require('express');
var app = express();
var request = require('request-promise');

var MongoClient = mongodb.MongoClient;
var mongoURI = process.env.SECRET;

//set static
app.use(express.static('public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//route for homepage
app.get('/', function(request, response) {
  response.render('index');
});


//route for image search
app.get('/api/imagesearch/:search',function(req,res){
  //url example /lolcats%20funny?offset=10
  
  //this should be moved to a seperate module and imported as a function
  //connect to database and validate connection - add search to search history collection
  MongoClient.connect(mongoURI, function(err, db) {
    if(err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established');
      var collection = db.collection('searches');
      
      var newSearch = {
        'term': req.params.search,
        'date': new Date()
      }
      
      collection.insert(newSearch);
    }
    db.close;
    console.log('Connection closed');
  })
  //end db insert
  
  //Set variables for imgur search
  var search = req.params.search;
  var offset = (req.query.offset) ? parseInt(req.query.offset) : 20;
  
  var options = {
      url: 'https://api.imgur.com/3/gallery/search/' + offset + '?q=' + search,
      headers: { Authorization: 'Client-ID ' + process.env.IMGUR_ID },
      json: true,
    };
  
  //use request-primise module - send search options and transform data once returned
  request(options)
    .then(function(response) {

      //filter for images only, not albums and then map to transform into only required fields
      response = response.data.filter(function(image) {
        if(!image.is_album) {
          return image;
        }
      }).map(function(image) {
        return {
          url: image.link,
          snippit: image.title,
          context: 'https://imgur.com/' + image.id
        }
      })

      res.send(response)
        
    })
    .catch(function(err) {
      res.send('Error: ', err)
  })  
  
});

//route for latest searches
app.get('/api/latest/',function(req,res){
  
  //connect to db and validate connection
  MongoClient.connect(mongoURI, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established');
        
        var collection = db.collection('searches');
        
        //create date for latest searches: today minus 5 days
        var latestDate = new Date();
        latestDate.setDate(latestDate.getDate() - 5);
        
        //find documents with a search date greater than 5 days ago
        collection.find({ "date": { $gt: latestDate } }, {"_id": 0, "term": 1, "date": 1})
          //assign results to array
          .toArray(function(err, searchList) {
            if(err) {
              throw err;
            }
            res.send(searchList)
        })
        
        db.close();
      }
  })
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
