var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazonDB'
})

connection.connect(function(err) {
	if (err) throw err;
	// console.log('Connected as id' + connection.threadId);
	startBuying();
})

function printStuff(res) {
	var table = new Table({
		head: ['Item ID', 'Product Name', 'Cost']
		, colWidths: [10, 45, 10]
	});
	for (var i = 0; i < res.length; i++) {
		table.push([res[i].item_id, res[i].product_name, res[i].price]);
	}
	console.log(table.toString());
}

var startBuying = function() {
	connection.query('SELECT * FROM products', function(err, res) {
		printStuff(res);
		// var choiceArray = [];
		// for (var i = 0; i < res.length; i++) {
		// 	choiceArray.push(res[i].product_name);
		// }
		inquirer.prompt([{
			name: 'item',
			type: 'input',
			message: 'Which item would you like to purchase? (Enter the Item ID)'
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'How many would you like to purchase?'
		}]).then(function(answer) {
			// console.log(answer);
			// var item_id = answer.item;
			// console.log(item_id);
            // var chosenItem = res.item_id;
            
            var chosenItem = connection.query('SELECT * FROM products WHERE ?', [{ item_id: answer.item }]);

            // for (var i = 0; i < res.length; i++) {
            //     console.log(res[i].item_id + " |" + answer.choice);
            //     if (res[i].item_id == answer.choice) {
            //         chosenItem = res[i];
            //     }
            // }
			// console.log(chosenItem);
            var newQuantity = chosenItem.stock_quantity - parseInt(answer.quantity);
            // console.log(newQuantity);
			if (newQuantity >= 0) {
				connection.query('UPDATE products SET ?? WHERE itemID = ?', [{ stock_quantity: newQuantity }, item_id]);
				startBuying();
			} else {
				console.log('There are not enough in stock for you to purchase that many.');
				startBuying();
			}
		})
	})
}