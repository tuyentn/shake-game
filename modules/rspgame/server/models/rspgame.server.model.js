'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rspgame Schema
 */
var RspgameSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  number: {
    type: Number,
    default: 0,
    trim: true,
    required: 'RoomNumber cannot be blank'
  },
  des: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user1: {
    displayName: {
      type: String,
      default: ''
    },
    score: {
      type: Number
    }
  },
  user2: {
    displayName: {
      type: String,
      default: ''
    },
    score: {
      type: Number
    }
  },
  redirect: {
    type: String
  }
});

mongoose.model('Rspgame', RspgameSchema);
