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
        restart()
    });
}

function viewTable() {
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
        restart()
    })
}


function addInv() {
    viewTable()
    inquirer.prompt([{
        name: "itemSelect",
        message: "\nPlease select the item you wish to update.\n"
    }, {
        name: "newQuant",
        message: "How much would you like to add to the inventory.\n"
    }]).then(function(answers) {

        var targetItem = answers.itemSelect
        connection.query("SELECT * FROM products", function(err, res) {

            function getProdQuant() {
                for (var i = 0; i < res.length; i++) {
                    if (targetItem == res[i].item_id) {

                        return res[i].stock_quantity
                    }
                }
            }

            var updateQuant = getProdQuant() + parseInt(answers.newQuant)

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

function addProd() {
    console.log("\nPlease fill out this form to add a new item:")
    inquirer.prompt([{
        name: "prodName",
        message: "\nEnter the name of the item you wish to add.\n"
    }, {
        name: "depName",
        message: "What department should this item be added to?\n"
    }, {
        name: "pr",
        message: "How much does this item cost?\n"
    }, {
        name: "sq",
        message: "How much would you like to add to the inventory.\n"

    }]).then(function(answers) {

        var query = connection.query(
            "INSERT INTO products SET ?", {
                product_name: answers.prodName,
                department_name: answers.depName,
                price: answers.pr,
                stock_quantity: answers.sq
            },
            function(err, res) {
                console.log("\nHere is the updated inventory:")
                viewProds()
                restart()
            }
        );

    })
}

function restart() {
    inquirer.prompt([{
        type: "list",
        name: "continue",
        choices: ["Yes", "No"],
        message: "Would you like to do more?\n"
    }]).then(function(answers) {
        if (answers.continue === "Yes") {
            manageProds();
        } else {
            console.log("Goodbye!");
            connection.end();
        }

    });
}

