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
	console.log('\n**********\nHello Mr. Manager! Welcome back to Bamazon, your go-to terminal program for managing illusory products!\n**********\n');
	start();
});

var start = function() {
    inquirer.prompt({
        type: "list",
        name: "option",
        message: "Please select one of the options below.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
    	var option = answer.option;
    	switch(option) {
    		case "View Products for Sale":
    			viewProducts(startAgain);
    			break;
    		case "View Low Inventory":
    			viewLowInv();
    			break;
    		case "Add to Inventory":
    			viewProducts(addInventory);
    			break;
    		case "Add New Product":
    			addProduct();
    			break;
    		default:
    			console.log("You'll probably never get to see this message...")
    	}
    })
};

var viewProducts = function(callback) {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			console.log(err);
		} else {
			idArray = [];
			console.log('\n### IN-STOCK PRODUCTS:');
			for (var i=0; i<res.length; i++) {
				console.log("====================");
				console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Price: $" + res[i].price + " | " + "Quantity: " + res[i].stock_quantity);
				console.log("====================");
				idArray.push((res[i].item_id).toString());
			}
			console.log("");
			callback();
		}
	});
};

var viewLowInv = function() {
	connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
		if (err) {
			console.log(err);
		} else {
			console.log('\n### LOW-STOCK PRODUCTS:');
			for (var i=0; i<res.length; i++) {
				console.log("====================");
				console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Price: $" + res[i].price + " | " + "Quantity: " + res[i].stock_quantity);
				console.log("====================");
			}
			console.log("");
			startAgain();
		}
	});
};

var addInventory = function() {
	inquirer.prompt([
    {
        type: "list",
        name: "id",
        message: "Please select the ID of the product that you want to add more of.",
        choices: idArray
    }, {
    	type: "input",
    	name: "quantity",
    	message: "Please enter the NUMBER of units that you want to add.",
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
    	connection.query("SELECT * FROM products WHERE item_id=?", [idInput], function(err, product) {
	    	if (err) {
				console.log(err);
			} else {
				connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [product[0].stock_quantity + quantityInput, idInput], function(err, res) {});
				console.log("==========\nUpdate successful!");
				console.log("You've added " + quantityInput + " unit(s) of " + product[0].product_name + ".\n==========");
	            startAgain();
			}
	    });
    })
};

var addProduct = function() {
	syncIds();
	console.log("");
	inquirer.prompt([
    {
        type: "input",
        name: "item_id",
        message: "Please enter a unique ID (number) for the new product that you want to add.",
    	validate: function(input) {
			if ((input.search(/^[\d]+$/)) === -1) {
				console.log("\n!!! Please enter a valid WHOLE NUMBER. !!!");
			} else if ((input === "0") || (idArray.indexOf(input)>-1)) {
				console.log("\n!!! IDs cannot be 0 or shared with another existing product. !!!");
			} else {
				return (input.search(/^[\d]+$/) !== -1);
			}
    	}
    }, {
    	type: "input",
    	name: "product_name",
    	message: "Please enter the name of this product.",
    	validate: function(input) {
			if (input.trim().length === 0) {
				console.log("\n!!! Please enter the product's name. !!!");
			} else {
				return true;
			}
    	}
    }, {
    	type: "input",
    	name: "department_name",
    	message: "Please enter the department name of where this product belongs to.",
    	validate: function(input) {
			if (input.trim().length === 0) {
				console.log("\n!!! Please enter the product's department. !!!");
			} else {
				return true;
			}
    	}
    }, {
    	type: "input",
    	name: "price",
    	message: "Please enter the price of this product.",
    	validate: function(input) {
			if ((input.search(/^[\d\.]+$/)) === -1) {
				console.log("\n!!! Please enter a valid NUMBER. !!!");
			} else {
				return (input.search(/^[\d\.]+$/) !== -1);
			}
    	}
    }, {
    	type: "input",
    	name: "stock_quantity",
    	message: "Please enter the stock quantity of this product.",
    	validate: function(input) {
			if ((input.search(/^[\d]+$/)) === -1) {
				console.log("\n!!! Please enter a valid WHOLE NUMBER. !!!");
			} else {
				return (input.search(/^[\d]+$/) !== -1);
			}
    	}
    }
    ]).then(function(answer) {
		connection.query("INSERT INTO products SET ?", {
            item_id: answer.item_id,
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock_quantity: answer.stock_quantity
        }, function(err, res) {
        	console.log("==========\nThe new product was successfully added!\n==========");
            startAgain();
        });
	})
};

var syncIds = function() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			console.log(err);
		} else {
			idArray = [];
			for (var i=0; i<res.length; i++) {
				idArray.push((res[i].item_id).toString());
			}
		}
	});
};

var startAgain = function() {
	inquirer.prompt({
		type: "confirm",
		name: "action",
		message: "Do you want to perform any other action?"
	}).then(function(answer) {
		if (answer.action === true) {
			start();
		} else {
			console.log("==========\nThank you, come again!\n==========");
			connection.end();
		}
	})
};