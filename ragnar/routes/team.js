/*
 * GET teamlist page.
 */

exports.teamlist = function(db) {
  return function(req, res) {
    db.collection('Teams').find().toArray(function (err, items) {
      res.json(items);
    })
  }
};

/*
 * POST to addteam.
 */

exports.addteam = function(db) {
  return function(req, res) {
    db.collection('Teams').insert(req.body, function(err, result){
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  }
};

/*
 * DELETE to deleteteam.
 */

exports.deleteteam = function(db) {
  return function(req, res) {
    var teamToDelete = req.params.id;
    db.collection('Teams').removeById(teamToDelete, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};
