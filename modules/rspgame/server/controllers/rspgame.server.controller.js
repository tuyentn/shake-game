'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rspgame = mongoose.model('Rspgame'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an rspgame
 */
exports.create = function (req, res) {
  var rspgame = new Rspgame(req.body);
  rspgame.user = req.user;
  rspgame.user1.displayName = req.user.displayName;
  rspgame.user1.score = req.user.score;
  rspgame.user2.displayName = '';
  rspgame.user2.score = 0;
  Rspgame.findOne({ number: rspgame.number}, function (err, found_room){
    if (!found_room) {
      rspgame.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(rspgame);
        }
      });
    } else {
      return res.status(403).send({
        message: 'Phòng đã tồn tại'
      });
    }
  });
};

/**
 * Show the current rspgame
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var rspgame = req.rspgame ? req.rspgame.toJSON() : {};

  // Add a custom field to the Rspgame, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Rspgame model.
  rspgame.isCurrentUserOwner = !!(req.user && rspgame.user && rspgame.user._id.toString() === req.user._id.toString());

  res.json(rspgame);
};

/**
 * Update an rspgame
 */
exports.update = function (req, res) {
  Rspgame.findById(req.rspgame._id, function (err, rspgame) {
    if (req.user.displayName == rspgame.user1.displayName) {
      console.log('User1 out');
      rspgame.user1.displayName = '';
      rspgame.user1.score = 0;
      rspgame.redirect = '';
    } else if (req.user.displayName == rspgame.user2.displayName) {
      console.log('User2 out');
      rspgame.user2.displayName = '';
      rspgame.user2.score = 0;
      rspgame.redirect = '';
    } else if (rspgame.user1.displayName == '') {
      console.log('User1 in');
      rspgame.user1.displayName = req.user.displayName;
      rspgame.user1.score = req.user.score;
      rspgame.redirect = rspgame._id;
    } else if (rspgame.user2.displayName == '') {
      console.log('User2 in');
      rspgame.user2.displayName = req.user.displayName;
      rspgame.user2.score = req.user.score;
      rspgame.redirect = rspgame._id;
    } else {
      return res.status(403).send({
        message: 'Phòng đã đầy'
      });
    }
    // if (rspgame.user1.displayName == '' && rspgame.user2.displayName == '') {
    //   rspgame.remove(function (err) {
    //     if (err) {
    //       return res.status(422).send({
    //         message: errorHandler.getErrorMessage(err)
    //       });
    //     } else {
    //       // res.json(rspgame);
    //     }
    //   });
    // } else {
      rspgame.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(rspgame);
        }
      });
    // }
  });
};

/**
 * Delete an rspgame
 */
exports.delete = function (req, res) {
  var rspgame = req.rspgame;

  rspgame.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // res.json(rspgame);
    }
  });
};

/**
 * List of rspgames
 */
exports.list = function (req, res) {
  Rspgame.find().sort('-created').populate('user', 'displayName').exec(function (err, rspgames) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rspgames);
    }
  });
};

/**
 * Rspgame middleware
 */
exports.rspgameByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return "create";
  }

  Rspgame.findById(id).populate('user', 'displayName').exec(function (err, rspgame) {
    if (err) {
      return next(err);
    } else if (!rspgame) {
      return res.status(404).send({
        message: 'No rspgame with that identifier has been found'
      });
    }
    req.rspgame = rspgame;
    next();
  });
};
