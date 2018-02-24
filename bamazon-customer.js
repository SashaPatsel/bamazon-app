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
            [res[i].item_id, res[i].product_name, res[i].department_name, "$"+res[i].price, res[i].stock_quantity],
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

            if (userQuant > getProdQuant() && getProdQuant() > 0) {

                console.log("Sorry, there are only " + getProdQuant() + " of that item left. Please choose a different amount.\n")
                startShopping();
            } else if (getProdQuant() <= 0) {
                console.log("Sorry we're actually sold out of that :(")
                startShopping();
            } else {
                updateStock()
            };

            function getProdName() {
                for (var i = 0; i < res.length; i++) {
                    if (parseInt(answers.itemPurch) === res[i].item_id) {
                        return res[i].product_name
                    }
                }
            }

            function getProdQuant() {
                for (var i = 0; i < res.length; i++) {
                    if (parseInt(answers.itemPurch) === res[i].item_id) {
                        return res[i].stock_quantity
                    }
                }
            }

            function getProdPrice() {
                for (var i = 0; i < res.length; i++) {
                    if (parseInt(answers.itemPurch) === res[i].item_id) {
                        return res[i].price
                    }
                }
            }



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



