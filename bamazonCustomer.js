// global variables defined
var mysql = require("mysql");
var inquirer = require("inquirer");

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
    startApp();
});

// define function with questions
function startApp() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // show items, prompt the user for the ID they'd like to buy
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].item_name);
                        }
                        return choiceArray;
                    },
                    message: "What is the ID of the item you'd like to purchase?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }

                // determine if there is enough quantity
                if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
                    // quantity was available, update item quantity in DB
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (chosenItem_stock_quantity - answer.quantity)
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
    });
};