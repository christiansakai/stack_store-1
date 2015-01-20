'use strict';

angular.module('stackStoreApp')
  .factory('addToCart', ['Auth', '$http', 'orderItems', 'cartTotal', function (Auth, $http, orderItems, cartTotal) {
    return function(item, optionsObj, newUser) {
	    //find current user

	    	// console.log("----item-----");
	    	// console.log(item);
	    	// console.log("-----item----");



	    if(newUser)
	    {

	    	// var oldItems = item;
	
	    	// console.log("---------");
	    	// console.log(item);
		    // console.log("---------");


	    	$http.put('/api/orders/'+newUser.cart, item)
	    		.success(function(newCart){
	    			return;
	    			// debugger;
	    			// for(var i in item)
	    			// {
	    			// 	orderItems.push(item[i]);
	    			// 	cartTotal.adjust(item[i].value * item[i].quantity);
	    			// }
	    		})
	    		.error(function(){
	    			//debugger;
	    		});

	    	return;
	    }

	    var user = Auth.getCurrentUser();
	    console.log("---------");
	    console.log(user);
	    console.log("---------");
	    //create temporary frontend object to send as req.body
	    var tempLineItem = {
	      item: item._id,
	      sender: user._id || null,
	      senderName: user.name || optionsObj.senderName,
	      senderEmail: user.email || optionsObj.senderEmail,
	      receiverName: optionsObj.receiverName,
	      receiverEmail: optionsObj.receiverEmail,
	      message: optionsObj.message,
	      quantity: optionsObj.quantity,
	      value: 20 //, //replace with actual value later
	        // themeURL: item.image
	    }

	    console.log("---------");
	    console.log(tempLineItem);
	    console.log("---------");

	    //if user has a cart: add to cart ONLY DO THIS IN FIRST STEP



	    //if user does not have a cart, create cart and add line item


	    // add that line item to the cart of the current user
	    //Push line item to users cart
	    //

	    $http.post('/api/lineItems/', tempLineItem, newUser)
	      .success(function(newLineItem, status) {
	        //newLineItem.item = item;
	        //$scope.orderItems.push(newLineItem);

		    orderItems.push(newLineItem);
	        //$scope.cartTotal += newLineItem.value;
	        cartTotal.adjust(newLineItem.value * newLineItem.quantity);
	      });
	 
	      // .error(function(data, status) {
	      //   console.log('Error Data = ' + data);
	      //   console.log('Error Status = ' + status);
	      // });
	    //$scope.modal.close(); //this works
	}
}]);