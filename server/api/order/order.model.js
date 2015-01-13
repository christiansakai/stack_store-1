'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LineItem = require('../lineItem/lineItem.model');

var OrderSchema = new Schema({
  orderItems: [LineItem.schema],
  status: String
});

module.exports = mongoose.model('Order', OrderSchema);
