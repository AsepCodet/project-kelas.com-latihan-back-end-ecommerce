create database dbEcommerce;

use dbEcommerce;

create table customers(
	customer_id int auto_increment,
    username varchar(100),
    email varchar(100),
    password varchar(255),
    region varchar(64),
    cart json,
    created_at datetime,
    update_at datetime,
    constraint customer_pk
		primary key(customer_id)
);

create table sellers(
	seller_id int auto_increment,
    username varchar(100),
    email varchar(100),
    password varchar(255),
    region varchar(64),
    products json,
    created_at datetime,
    update_at datetime,
    constraint seller_pk
		primary key(seller_id)
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT,
    product_name VARCHAR(100),
    description longtext,
    stock INT,
    price INT,
    id_seller INT,
    created_at DATETIME,
    CONSTRAINT product_pk PRIMARY KEY (product_id),
    FOREIGN KEY (id_seller)
        REFERENCES sellers (seller_id)
);


CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    id_customer INT,
    id_seller INT,
    product_list JSON,
    total_price int, 
    sender_region VARCHAR(64),
    receiver_region VARCHAR(64),
    create_time DATETIME,
    status ENUM('completed', 'not completed'),
    FOREIGN KEY (id_customer) REFERENCES customers(customer_id),
    FOREIGN KEY (id_seller) REFERENCES sellers(seller_id)
);


