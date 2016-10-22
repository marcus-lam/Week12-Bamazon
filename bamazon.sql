CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE `products` (
  `item_id` int(11) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `department_name` varchar(50) NOT NULL,
  `price` float NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_id_UNIQUE` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO bamazon.products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Cards Against Humanity", "Toys & Games", 25.00, 10),
(2, "Catan 5th Edition", "Toys & Games", 31.99, 10),
(3, "Jenga Classic Game", "Toys & Games", 11.49, 5),
(4, "Battlefield 1", "Video Games", 59.99, 25),
(5, "Call of Duty: Infinite Warfare", "Video Games", 79.99, 15),
(6, "Gears of War 4", "Video Games", 58.99, 15),
(7, "Sid Meier's Civilization VI", "Video Games", 59.99, 15),
(8, "Harry Potter and the Cursed Child", "Books", 17.99, 10),
(9, "First 100 Words", "Books", 3.99, 10),
(10, "World of Warcraft: The Official Cookbook", "Books", 21.99, 10);