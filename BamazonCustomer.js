var mysql = require('mysql');
var inquirer = require('inquirer');
var idArray = [];

var connection = mysql.createConnection({
  host: //'127.0.0.1',
  port: //3306,
  user: //'YOUR USERNAME HERE',
  password: //'YOUR PASSWORD HERE',
  database: 'bamazon'
});
 
connection.connect(function(err) {
	if (err) throw err;
	// console.log('Connected as ID ' + connection.threadId + '.');
	console.log('\n**********\nWelcome to Bamazon, your one-stop terminal shop for buying illusory products!\n**********');
	logProducts();
});

function logProducts() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			console.log(err);
		} else {
			idArray = [];
			console.log('\n### IN-STOCK PRODUCTS:');
			for (var i=0; i<res.length; i++) {
				console.log("====================");
				console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Price: $" + res[i].price);
				console.log("====================");
				idArray.push((res[i].item_id).toString());
			}
			console.log("");
			start();
		}
	});
};

var start = function() {
    inquirer.prompt([
    {
        type: "list",
        name: "id",
        message: "Please select the ID of the product that you want to purchase.",
        choices: idArray
    }, {
    	type: "input",
    	name: "quantity",
    	message: "Please enter the NUMBER of units that you want to purchase.",
    	validate: function(input) {
			if ((input.search(/^[\d]+$/)) === -1) {
				console.log("\n!!! Please enter a valid WHOLE NUMBER. !!!");
			} else {
				return (input.search(/^[\d]+$/) !== -1);
			}
    	}
    }
    ]).then(function(answer) {
    	var idInput = parseInt(answer.id);
    	var quantityInput = parseInt(answer.quantity);
    	order(idInput, quantityInput);
    })
};

var startAgain = function() {
	inquirer.prompt({
		type: "confirm",
		name: "shop",
		message: "Do you want to continue shopping for imaginary goods?"
	}).then(function(answer) {
		if (answer.shop === true) {
			logProducts();
		} else {
			console.log("==========\nThank you, come again!\n==========");
			connection.end();
		}
	})
};

var sync = function() {
	connection.query("DELETE FROM products WHERE stock_quantity=0", function(err, res) {});
};

var order = function(idInput, quantityInput) {
	connection.query("SELECT * FROM products WHERE item_id=?", [idInput], function(err, product) {
		if (err) {
			console.log(err);
		} else if (product[0].stock_quantity - quantityInput >= 0) {
			connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [product[0].stock_quantity - quantityInput, idInput], function(err, res) {});
			console.log("==========\nThank you for shopping at Bamazon!");
			console.log("You purchased " + quantityInput + " unit(s) of " + product[0].product_name + ".");
            console.log("You will be charged $" + (product[0].price * quantityInput) + ".\n==========");
            sync();
            startAgain();
		} else {
			console.log("==========\nInsufficient quantity! Bamazon only has " + product[0].stock_quantity + " unit(s) of " + product[0].product_name + " left. Please adjust your order accordingly.\n==========");
			start();
		}
	})
};