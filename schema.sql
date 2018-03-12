DROP DATABASE IF EXISTS bamazonDb;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(80) NOT NULL,
  department_name VARCHAR(80) NOT NULL,
  stock_quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (item_id)
);


