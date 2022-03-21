INSERT INTO department (name) 
VALUES ("Manager"), ("Sales"), ("Lead Sales"), ("Accounting"), ("Legal");

INSERT INTO role (title, salary, department_id) 
VALUES 
    ("Manager", 200000, 1),
    ("Assistant Manager", 100000, 1),
    ("Sales", 60000, 2),
    ("Lead Sales", 700000, 2),
    ("Accounting", 90000, 3),
    ("Legal", 100000, 3),
    ("Sales", 60000, 4),
    ("Junior Sales", 45000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
    ("Ron", "Swanson", 1, NULL),
    ("Leslie", "Knope", 2, 1),
    ("April", "Ludgate", 3, NULL),
    ("Tom", "Haverford", 4, 3),
    ("Ben", "Wyatt", 5, NULL),
    ("Donna", "Meagle", 6, 5),
    ("Ann", "Perkins", 7, NULL),
    ("Mona", "Lisa", 8, 7);

    SELECT * FROM department;
    SELECT * FROM role;
    SELECT * FROM employee;