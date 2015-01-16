'use strict';

var _ = require('lodash');
var Order = require('./order.model');

// Get list of orders
exports.index = function(req, res) {
  Order.find(function(err, orders) {
    if (err) {
      return handleError(res, err);
    }
    Order.populate(orders, 'orderItems', function() {
        //console.log('order items + lineItem info: ', order);
        Order.populate(orders, {
          path: 'orderItems.item',
          model: 'Item'
        }, function() {
          //console.log('order items + items info: ', order);
          Order.populate(orders, 'user', function() {
            return res.json(200, orders);

          });
        });
      });
  });
};

// Get a single order
exports.show = function(req, res) {
  console.log(req.params.id);
  Order.findById(req.params.id, function(err, order) {


      if (err) {
        return handleError(res, err);
      }
      if (!order) {
        return res.send(404);
      }

      Order.populate(order, 'orderItems', function() {
        //console.log('order items + lineItem info: ', order);
        Order.populate(order, {
          path: 'orderItems.item',
          model: 'Item'
        }, function() {
          //console.log('order items + items info: ', order);
          Order.populate(order, 'user', function() {
            return res.json(order);

          });
        });
      });
    })
    // .populate('orderItems')
    // .exec(function(err, orderItems){
    //   console.log(err + orderItems);
    // });
};

// Creates a new order in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, order) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, order);
  });
};

// Updates an existing order in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findById(req.params.id, function(err, order) {
    if (err) {
      return handleError(res, err);
    }
    if (!order) {
      return res.send(404);
    }
    var updated = _.merge(order, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, order);
    });
  });
};

// Deletes a order from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function(err, order) {
    if (err) {
      return handleError(res, err);
    }
    if (!order) {
      return res.send(404);
    }
    order.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}