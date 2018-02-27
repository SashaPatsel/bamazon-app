# Bamazon App

Bamazon simulates the shopping experience of a retail website.
It features a customer mode, and a manger mode. 
In customer mode, the user can purchase products and view the total for their purchase.
In manager mode, the user can view the current inventory, view items with low inventory, add to a given item's inventory, or add a product. 



## Getting Started

This is a CLI node application.
  *ran solely through terminal*

### Installing

to install dependencies
```
npm i
```

## Running the tests


Create local database from schema provided.
*(add table and seeds)*
  - make sure to update your local password for mysql in each file being ran.

`bamazon.sql`

```
USE bamazonDB;
```

To run customer view Use
`node bamazon-customer.js`


### Functionality

#### The app:
<img src="images/demo1.png" height="400px" width="300">

<img src="images/demo2.png" height="200px" width="250">

<img src="images/demo4.png" height="400px" width="450">

#### Code:
Inquirer example:
```
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
```

Customer view query example:
```
var updateRev = (getProdSales() + (userQuant * getProdPrice()))
connection.query(
    "UPDATE products SET ? WHERE ?", [{
            product_sales: updateRev
        },
        {
            item_id: answers.itemPurch
        }
    ],
    function(err, res) {
        // console.log(updateRev);
    }
);
```


Manager view query example:
```
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
```

## Built With

* [mysql](https://www.npmjs.com/package/mysql) - The MySQL pack used
* [node.js](https://nodejs.org/en/) - The backend JavaScript Framework
* [inquirer](https://www.npmjs.com/package/inquirer) - Allows user interactivity
* [CLI table](https://www.npmjs.com/package/cli-table) - Generated a table for data in database


## Authors

* **Sasha Patsel** - *Initial work* - [Bamazon](https://github.com/SashaPatsel/bamazon-app)


