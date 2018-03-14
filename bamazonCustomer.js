// Node Dependencies set
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// Create a connection to MYSQL
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazonDB'
});

// begin connection to mysql, begin app
connection.connect(function (err) {
	if (err) throw err;
	startApp();
});

// define function to build products table to display
function ShowProducts(res) {
	var table = new Table({
		head: ['Item ID', 'Product Name', 'Cost']
		, colWidths: [10, 45, 15]
	});
	for (var i = 0; i < res.length; i++) {
		table.push([res[i].item_id, res[i].product_name, res[i].price]);
	}
	console.log(table.toString());
};

// define function that captures input, calculates quantity, is sale valid or not
var startApp = function () {
	// query mysql, get all products returned
	connection.query('SELECT * FROM products', function (err, res) {
		// call function to display returned products
		ShowProducts(res);
		var choiceArray = [];
		for (var i = 0; i < res.length; i++) {
			choiceArray.push(res[i]);
		}
		// begin inquirer to capture inputs
		inquirer.prompt([{
			name: 'item',
			type: 'input',
			message: 'Which item would you like to purchase? (Enter the Item ID)'
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'How many would you like to purchase?'
		}]).then(function (answer) {
			// console.log(answer);
			var itemChoice = parseInt(answer.item);
			// console.log(itemChoice);
			var chosenItem = choiceArray[itemChoice - 1];
			// console.log(chosenItem);


			// calculate quantity of chosenItem
			var itemQuantity = parseInt(answer.quantity);
			var updatedQuantity = chosenItem.stock_quantity - itemQuantity;
			// console.log(updatedQuantity);

			// if quantity selected does not exceed quantity in stock, update MYSQL
			if (updatedQuantity >= 0) {
				console.log("Your purchase was a success! Thank you for your business.");
				console.log("Can we interest you in anything else?");
				connection.query(
					'UPDATE products SET ? WHERE ?', [
						{
							stock_quantity: updatedQuantity
						},
						{
							item_id: itemChoice
						}
					]);
				setTimeout(function () {
					startApp();
				}, 3000);
			} else {
				console.log("Sorry, we currently do not have that many in stock, please check back later.");
				setTimeout(function () {
					startApp();
				}, 3000);
			}
		});
	});
};