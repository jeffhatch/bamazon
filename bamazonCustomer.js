// DROP DATABASE IF EXISTS bamazon;

// CREATE DATABASE bamazon;

// USE bamazon;

// CREATE TABLE products (
//     item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
//     product_name VARCHAR(30) NOT NULL,
//     department_name VARCHAR(30) NOT NULL,
//     price DECIMAL(7,2),
//     stock_quantity INTEGER(10),
//     PRIMARY KEY (item_id)
// );

// USE bamazon;

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Walkman", "Electronics", 120.00, 10);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("MP3 Player", "Electronics", 30.00, 5);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("U2 - Joshua Tree", "Music", 15.00, 2);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Paramore - Paramore", "Music", 15.00, 3);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("The Killers - Hot Fuss", "Music", 14.00, 4);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Provolone", "Cheese", 5.00, 10);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("American", "Cheese", 6.00, 7);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Swiss", "Cheese", 4.00, 6);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Munster", "Cheese", 6.00, 8);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Bree", "Cheese", 50.00, 10);

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: "root",
  password: "yN9mBbOJ4StF",
  database: "bamazon"
});

// Places an order if there is sufficient stock
let PlaceOrder = (item_id, quantity) => {
  let query = "SELECT price, stock_quantity FROM products WHERE ?";
  connection.query(query, { item_id: item_id }, function (err, res1) {
    if (err) throw err;
    let price = res1[0].price;
    let stock_quantity = res1[0].stock_quantity;
    if (quantity > stock_quantity) {
      console.log("Unable to complete order. There are not enough items in stock.")
      BamazonApp();
    } else {
      let new_stock_quantity = stock_quantity - quantity;
      let purchasequery = "UPDATE products SET ? WHERE ?";
      connection.query(purchasequery, [{ stock_quantity: new_stock_quantity}, {item_id: item_id }], function (err, res2) {
        if (err) throw err;
        console.log(`Success! Your total is $${price * quantity}`);
      });
    }
  });
}

// Get quantity from user
let PromptUser2 = (item_id) => {
  inquirer.prompt({
      name: "quantity",
      type: "input",
      message: "How many do you want to buy?: ",
      default: "0"
  }).then(function (answer) {
      let quantity = answer.quantity;
      if (quantity === "0") {
        console.log("You must buy at least 1 item.");
        PromptUser2();
      } else {
        PlaceOrder(item_id, quantity)
      }
  });
}

// Get item ID from user
let PromptUser = () => {
  inquirer.prompt({
      name: "item_id",
      type: "input",
      message: "Please enter the Item ID of the product you wish to buy: ",
      default: "0"
  }).then(function (answer) {
      let item_id = answer.item_id;
      if (item_id === "0") {
        console.log("Please enter a valid Item ID.");
        PromptUser();
      } else {
        PromptUser2(item_id)
      }
  });
}

// Main Program, lists available products
let BamazonApp = () => {
  let query = "SELECT item_id, product_name, price FROM products";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log(`${res[i].item_id} | ${res[i].product_name} | ${res[i].price}`);
    }
    PromptUser();
  });
}

// Connect to database and run main program
connection.connect(function (err) {
  if (err) throw err;
  BamazonApp();
});