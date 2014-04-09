
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Bootstrap Temp' });
};

exports.teamlist = function(db) {
    return function(req, res) {
        var collection = db.get('Teams');        
        collection.find({},{},function(e,docs){
            console.log(docs);
            res.render('teamlist', {
                "teamlist" : docs
            });
        });
      //res.json - use this to return as a json list
    };
};

exports.newteam = function(req, res){
  res.render('newteam', { title: 'Add New Team' });
};

exports.addteam = function(db) {
    return function(req, res) {
        // Get our form values. These rely on the "name" attributes
        var teamname = req.body.teamname.trim();
        // Set our collection
        var collection = db.get('Teams');
        
        // Validations
        if (teamname === '') {
          res.send('Unique team name required!');
          return;
        }
        // Submit to the DB
        collection.insert({
            "name" : teamname
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("teams");
                // And forward to success page
                res.redirect("teams");
            }
        });
    }
}