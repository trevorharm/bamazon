// global variables defined
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('cli-table');
// create connection to mySQL, store in variable
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

// begin connection to mysql, call function
connection.connect(function (err) {
    if (err) throw err;
    // queryAllProducts();
    startApp();
});

// Define how to show products using cli-table
function formatProducts(res) {
	var table = new Table({
		head: ['Item ID', 'Product Name', 'Price']
		, colWidths: [10, 45, 8]
	});
	for (var i = 0; i < res.length; i++) {
		table.push([res[i].item_id, res[i].product_name, res[i].price]);
	}
	console.log(table.toString());
}

// define function with questions
function startApp() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        formatProducts(res);

        // show items, prompt the user for the ID they'd like to buy
        // console.log(results);
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        // build list of answers to question
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].item_id, res[i].product_name, res[i].stock_quantity);
                        }
                        // show items to buy
                        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);;
                        // return choiceArray;
                    },
                    message: "What is the ID of the item you'd like to purchase?"
                },
                {
                    name: "amount",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function (answer) {
                console.log(answer);

                // get the information of the chosen item
                var chosenItem;

                for (var i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + " |" + answer.choice);
                    if (res[i].item_id == answer.choice) {
                        chosenItem = results[i];
                    }
                }
                console.log(chosenItem);
                // determine if there is enough quantity
                var quantity = (chosenItem.stock_quantity - parseInt(answer.amount));
                if (quantity >= 0) {
                    // quantity was available, update item quantity in DB
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: quantity
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Item purchased successfully!");
                            startApp();
                        }
                    );
                }
                else {
                    //the quantity too much, not enough in stock
                    console.log("Insufficient quantity, please review your order and try again");
                    startApp();
                }
            })
    }
    )
};

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("-----------------------------------");
    });
};


