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
    supervise()
});




function supervise() {
    inquirer.prompt([{
        type: "list",
        name: "superviseOptions",
        choices: ["View Products Sales by Department", "Create New Department"],
        message: "Hello manager, what would you like to do?\n"
    }]).then(function(answers) {
        if (answers.superviseOptions === "View Products Sales by Department") {
            prodByDep()

        } else if (answers.superviseOptions === "Create New Department") {
            newDep()

        }

    });
}


function prodByDep() {
    inquirer.prompt({
            name: "checkDep",
            type: "input",
            message: "What department would you like to search for?"
        })
        .then(function(answer) {
            // WHERE departments.department_name = ? ORDER by products.department_name
            // , [answer.checkDep]
                 var query = "SELECT products.product_name, products.department_name, products.price, products.product_sales, departments.over_head_costs FROM products INNER JOIN departments ON departments.department_name = products.department_name ";

                connection.query(query, function(err, res) {
                    // for (var i = 0 ; i < res.length; i++) {
                    //     console.log(res[i])
                    // }

                    console.log(res)

                });


            })

}

    function newDep() {

    }



    // function viewProds() {
    //     connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {

    //         var table = new Table({
    //             head: ["ID", "Item", "Category", "Price", "Available"],
    //             colWidths: [10, 20, 15, 10, 10]
    //         });

    //         // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    //         for (var i = 0; i < res.length; i++) {
    //             table.push(
    //                 [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity],
    //             );
    //         }
    //         console.log(table.toString());
    //         restart()
    //     });
    // }