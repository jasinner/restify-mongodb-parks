var config      = require('config'),
mongojs     = require('mongojs');
var https = require('https');
var fs = require('fs');

var db_config   = config.db_config,
collection_name = config.collection_name;
var db = mongojs(db_config + collection_name, [collection_name] );
var fileName = __dirname + '/../akltransport.json';
var url = 'https://api.at.govt.nz/v1/gtfs/stops?api_key=0784648a-8a58-444b-a1ff-38ab9e8f8e8b';

function init_db(){
  var file = fs.createWriteStream(fileName);
  var request = https.get(url, function(response) {
    response.pipe(file).on('close', function(){
     import_data();
   });
  });
}

function import_data() {
  var points = require(fileName);
  db[collection_name].ensureIndex({'pos':"2d"}, function(err, doc){
    if(err){
      console.log(err);
      return db.close();
    }else{
      console.log("index added on 'pos'");
      db[collection_name].count(function(errr, count){
        if(errr){
          console.log(errr);
        }else if(count > 0){
          console.log("data already exists - bypassing db initialization work...");
        }else{
          console.log("Importing map points...");
          for (var i = 0; i < points.response.length; i++){
            console.log(points.response[i]);
            db[collection_name].insert(points.response[i]);
          }
        }
        return db.close();
      });
    }
  });
}

function flush_db(){
  console.log("Dropping the DB...");
  db[collection_name].drop(function(err){
    if(err){
      console.log(err);
    }
    return db.close();
  });
} 

function select_box(req, res, next){
  //clean these variables:
  var query = req.query;
  var lat1 = Number(query.lat1),
  lon1 = Number(query.lon1),
  lat2 = Number(query.lat2),
  lon2 = Number(query.lon2);
  var limit = (typeof(query.limit) !== "undefined") ? query.limit : 40;
  if(!(Number(query.lat1) 
    && Number(query.lon1) 
    && Number(query.lat2) 
    && Number(query.lon2)
    && Number(limit)))
  {
    res.send(500, {http_status:400,error_msg: "this endpoint requires two pair of lat, long coordinates: lat1 lon1 lat2 lon2\na query 'limit' parameter can be optionally specified as well."});
    return console.error('could not connect to the database', err);
  }
  db[collection_name].find( {"pos" : {'$within': { '$box': [[lon1,lat1],[lon2,lat2]]}}}).limit(limit).toArray(function(err,rows){
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    res.send(rows);
    return rows;
  });
};
function select_all(req, res, next){
  console.log(db);
  db[collection_name].find(function(err, rows){
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    res.send(rows);
    return rows;
  });
};

module.exports = exports = {
  selectAll: select_all,
  selectBox: select_box,
  flushDB:   flush_db,
  initDB:    init_db,
  importData: import_data
};
