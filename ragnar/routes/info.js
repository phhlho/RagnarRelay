/*
 * GET info.
 */

exports.getInfo = function(db) {
  return function(req, res) {
    db.collection('TeamInfo').find().limit(1).toArray(function (err, items) {
      res.json(items);
    })
  }
};

/*
 * POST to storeInfo.
 */

exports.saveInfo = function(db) {
  return function(req, res) {    
    var saveInfo = {};
    saveInfo.raceStart = req.body.raceStart ? new Date(req.body.raceStart) : null;
    saveInfo.currentLegStartTime = req.body.currentLegStartTime ? new Date(req.body.currentLegStartTime) : null;
    saveInfo.currentTotalTime = req.body.currentTotalTime ? Number(req.body.currentTotalTime) : 0;
    saveInfo.currentLegIndex = req.body.currentLegIndex ? Number(req.body.currentLegIndex) : 0;
    saveInfo.currentRotationIndex = req.body.currentRotationIndex ? Number(req.body.currentRotationIndex) : 0;
    saveInfo.legCompletionTime = [
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1],
      [-1,-1,-1]
    ];
    for (var x = 0; x < 12; x++) {
      for (var y = 0; y < 3; y++) {
          saveInfo.legCompletionTime[x][y] = req.body.legCompletionTime[x][y] ? Number(req.body.legCompletionTime[x][y]) : -1;
      }
    }

    db.collection('TeamInfo').remove({}, function(err, result) {});    
    db.collection('TeamInfo').insert(saveInfo, function(err, result){      
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  }
};