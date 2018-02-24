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
    manageProds()
});




function manageProds() {
    inquirer.prompt([{
        type: "list",
        name: "manageOptions",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        message: "Hello manager, what would you like to do?\n"
    }]).then(function(answers) {
        if (answers.manageOptions === "View Products for Sale") {
            viewProds()

        } else if (answers.manageOptions === "View Low Inventory") {
            viewLowInv()

        } else if (answers.manageOptions === "Add to Inventory") {
            addInv()

        } else if (answers.manageOptions === "Add New Product") {
            addProd()
        }

    });
}

function viewProds() {
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

    });
}

function viewLowInv() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {

        var table = new Table({
            head: ["ID", "Item", "Category", "Price", "Available"],
            colWidths: [10, 20, 15, 10, 10]
        });

        // table is an Array, so you can `push`, `unshift`, `splice` and friends 
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 2000) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity],
                );
            }
        }
        console.log("\nThese are all the items with less than 2000 units left in their inventory:")
        console.log(table.toString());
    })
}


function addInv() {
    viewProds()
    inquirer.prompt([{
        name: "itemSelect",
        message: "\nPlease select the item you wish to update.\n"
    }, {
        name: "newQuant",
        message: "How much would you like to add to the inventory.\n"
    }]).then(function(answers) {

        var targetItem = answers.itemSelect
        console.log(targetItem)
        connection.query("SELECT * FROM products", function(err, res) {
          
            function getProdQuant() {
                for (var i = 0; i < res.length; i++) {
                    if (targetItem == res[i].item_id) {

                        return res[i].stock_quantity
                    }
                }
            }

            var updateQuant = getProdQuant() - answers.newQuant
            
            connection.query(
                "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: updateQuant
                    },
                    {
                        item_id: targetItem
                    }
                ],
                function(err, res) {
                    console.log("\nHere is a review of your update:")
                    

                    viewProds()

                }
            );
        })
    })
}


// Create a new Node application called bamazonManager.js. Running this application will:
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.