DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price DECIMAL(10,2),
  stock_quantity INT(20),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Far Cry 5", "Video Games", 59.99, 3000000), ("Harry Potter and the Order of the Phoenix", "Books", 19.99, 30000000), ("Kevin Durant NBA Jersey", "Apparel", 95.99, 1000000), ("Brookstone Massage Chair", "Furniture", 359.99, 150000), ("Feather Pillow", "Furniture", 20.00, 15000000), ("Elder Scrolls VI", "Video Games", 59.99, 100), ("A Song of Ice and Fire: The Winds of Winter", "Books", 500000000.00, 0), ("Spalding Basketball", "Athletics", 29.99, 3000000), ("LG TV", "Electronics", 1599.99, 60000), ("Spatula", "Home Appliances", 6.49, 8000000);

SELECT * FROM products;

 