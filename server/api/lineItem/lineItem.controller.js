'use strict';

var _ = require('lodash');
var LineItem = require('./lineItem.model');
var Order = require('../order/order.model');
var User = require('../user/user.model');

// Get list of lineItems
exports.index = function(req, res) {
  LineItem.find(function(err, lineItems) {
    if (err) {
      return handleError(res, err);
    }
    LineItem.populate(lineItems, 'item', function() {
      return res.json(200, lineItems);
    })
  });
};

// Get a single lineItem
exports.show = function(req, res) {
  LineItem.findById(req.params.id, function(err, lineItem) {
    if (err) {
      return handleError(res, err);
    }
    if (!lineItem) {
      return res.send(404);
    }
    LineItem.populate(lineItem, 'item', function() {
      return res.json(lineItem);
    });
  });
};

// Creates a new lineItem in the DB.
// exports.create = function(req, res) {
//   LineItem.create(req.body, function(err, lineItem) {
//     console.log('we created this lineItem: ', lineItem);
//     if (err) {
//       return res.json(422, err);
//       //return handleError(res, err);
//     }
//     if (!lineItem.sender) return res.json(201, lineItem);

//     Order.findOneAndUpdate({ userId:lineItem.sender._id },
//     {$push: { orderItems: lineItem._id }},
//       function(err, order) {
//         console.log('We found this order: ', order);
//         if (err) {
//           console.log(err);
//         }
//         console.log('lineItem unpopulated', lineItem);
//         LineItem.populate(lineItem, 'item', function() {
//         console.log('lineitem populated: ', lineItem)
//         return res.json(201, lineItem);
//       });
//     });
//   });
// };

exports.create = function(req, res) {
  var tempLineItem = req.body;
  var cart = req.body.cartId;
  //console.log('Adding this item: ', tempLineItem);

  LineItem.create(tempLineItem, function(err, lineItem)
  {
    if(err){return res.json(422, err);}

    if(lineItem.sender)
    {
      //console.log('this is the sender: ', lineItem.sender);
      //console.log('this is its id', lineItem._id);
      //console.log('this is the cart id', cart);
      Order.findOneAndUpdate({ user:lineItem.sender, status:'cart' },
        {$push: { orderItems:lineItem._id }})
        .exec(function(err, order)
        {
          //console.log('there was this error', err);
          //console.log('this is the updated order: ', order);
          if(err){return res.json(422, err);}
          LineItem.populate(lineItem, 'item', function()
          {
            var returnedObj = {orderId: 'not needed', lineItem: lineItem};
            return res.json(201, returnedObj);
          });
        })
    }

    else
    {
      console.log("Cart, ", cart);
      Order.findOrCreateAndAdd(cart, lineItem, function(err, order)
      {
        if(err){console.log("error 1"); return res.json(422, err);}
        LineItem.populate(lineItem, 'item', function(err, result)
        {
          if(err){console.log("error 2"); return res.json(422, err);}
          var returnedObj = {orderId: order._id, lineItem: result}
          console.log(returnedObj)
          return res.json(201, returnedObj);
        })
      });
    }
  });
}

// exports.create = function(req, res) {
//   LineItem.create(req.body, function(err, lineItem) {
//     if(err){
//       return handleError(res,err);
//     }
//     if(!lineItem.sender) return res.json(201, lineItem);
//
//     User.findById(lineItem.sender._id, function(err, user){
//       console.log(user);
//       lineItem.orderId = user.cart;
//       lineItem.save(function(err, lineItem){
//         console.log('lineItem unpopulated', lineItem);
//         LineItem.populate(lineItem, 'item', function() {
//           console.log('lineitem populated: ', lineItem)
//           return res.json(201, lineItem);
//         });
//       });
//     });
//   });
// }

// Updates an existing lineItem in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  LineItem.findById(req.params.id, function(err, lineItem) {
    if (err) {
      return handleError(res, err);
    }
    if (!lineItem) {
      return res.send(404);
    }
    var updated = _.merge(lineItem, req.body);
    updated.save(function(err) {
      if (err) {
        return res.json(422, err);
        //return handleError(res, err);
      }
      return res.json(200, lineItem);
    });
  });
};

// Deletes a lineItem from the DB.
exports.destroy = function(req, res) {
  LineItem.findById(req.params.id, function(err, lineItem) {
    if (err) {
      return handleError(res, err);
    }
    if (!lineItem) {
      return res.send(404);
    }
    lineItem.remove(function(err) {
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
