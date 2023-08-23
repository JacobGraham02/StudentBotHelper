CREATE DATABASE discord_student_helper_bot;
USE discord_student_helper_bot;

SELECT * FROM student;
DELETE FROM student WHERE username='Jacob' OR username='Jacob2';
SET SQL_SAFE_UPDATES = 0;

CREATE TABLE student (
	id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    discord_username VARCHAR(40) DEFAULT NULL UNIQUE,
    salt VARCHAR(255) DEFAULT NULL UNIQUE,
    home_location VARCHAR(100) DEFAULT NULL,
	school_location VARCHAR(100) DEFAULT NULL
) Engine=InnoDB;

CREATE TABLE student_class (
	id VARCHAR(36) PRIMARY KEY,
    class_time TIME DEFAULT NULL,
    class_location VARCHAR(20) DEFAULT NULL,
    class_midterm_date DATE DEFAULT NULL,
    class_exam_date DATE DEFAULT NULL,
    FOREIGN KEY(id) REFERENCES student(id)
) Engine=InnoDB;

CREATE TABLE student_class_work (
	id VARCHAR(36) PRIMARY KEY,
    class_work_name VARCHAR(50) DEFAULT NULL,
    class_work_start_date DATETIME DEFAULT NULL,
    class_work_end_date DATETIME DEFAULT NULL,
    class_work_notes TEXT DEFAULT NULL,
    FOREIGN KEY(id) REFERENCES student_class(id)
) Engine=InnoDB;

SHOW TABLES;

DROP TABLE IF EXISTS student_class_work;
DROP TABLE IF EXISTS student_class;
DROP TABLE IF EXISTS student;