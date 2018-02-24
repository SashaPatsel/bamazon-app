var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
});


connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {

    var table = new Table({
        head: ["ID", "Item", "Category", "Price", "Available"],
        colWidths: [10, 20, 15, 10, 10]
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    for (var i = 0; i < res.length; i++) {
        table.push(
            [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity],
        );
    }
    console.log(table.toString());
    startShopping()

    // connection.end()

});


function startShopping() {
    inquirer.prompt([{
        name: "itemPurch",
        message: "\nPlease eneter the ID of the item you would like to buy.\n"
    }, {
        name: "itemQuant",
        message: "How many would you like to buy.\n"
    }]).then(function(answers) {
        var userInput = answers.itemPurch
        var userQuant = answers.itemQuant
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;

            function getProdName() {
                for (var i = 0; i < res.length - 1; i++) {
                    if (parseInt(answers.itemPurch) === res[i].item_id) {
                        return res[i].product_name
                    }
                }
            }

            function getProdQuant() {
                for (var i = 0; i < res.length - 1; i++) {
                    if (parseInt(answers.itemPurch) === res[i].item_id) {
                        return res[i].stock_quantity
                    }
                }
            }

            function getProdPrice() {
                for (var i = 0; i < res.length - 1; i++) {
                    if (parseInt(answers.itemPurch) === res[i].item_id) {
                        return res[i].price
                    }
                }
            }

            if (parseInt(answers.userQuant) > getProdQuant()) {

                console.log("Sorry, there are only " + getProdQuant() + " of that item left. Please choose a different amount.\n")
                startShopping();
            } else if (getProdQuant() <= 0) {
                ("Sorry we're actually sold out of that :(")
                startShopping();
            } else {
                updateStock()
            };
// getProdQuant() - parseInt(answers.userQuant)
// answers.itemPurch
            function updateStock() {
              var updateQuant = (getProdQuant() - userQuant)
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                            stock_quantity: updateQuant
                        },
                        {
                            item_id: answers.itemPurch
                        }
                    ],
                    function(err, res) {
                        console.log("\nThanks for you purchase of " + getProdName() + "! Your item cost $" + getProdPrice() + "\n");
                        console.log(res.affectedRows + " products updated!\n");
                        restart()
                    }
                );
            }

            function restart() {
                inquirer.prompt([{
                    type: "list",
                    name: "continue",
                    choices: ["Yes", "No"],
                    message: "Would you like to continue shopping?\n"
                }]).then(function(answers) {
                    if (answers.continue === "Yes") {
                        startShopping();
                    } else {
                        console.log("Thanks for shopping. Please come again");
                        connection.end();
                    }

                });
            }
            

        });
    })
}



// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.