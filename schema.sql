CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    names VARCHAR(30),
    PRIMARY KEY (id)
    );
    

    CREATE TABLE roles (
id INTEGER AUTO_INCREMENT NOT NULL,
PRIMARY KEY (id),
title VARCHAR(30),
salary DECIMAL,
dept_id INTEGER NOT NULL,
FOREIGN KEY (dept_id) REFERENCES departments(id)
);
