CREATE DATABASE discord_student_helper_bot;
USE discord_student_helper_bot;

SELECT * FROM common_class;
SELECT * FROM common_class_work;
DELETE FROM common_class;
DELETE FROM common_class_work;
SET SQL_SAFE_UPDATES = 0;

CREATE TABLE common_class (
    id VARCHAR(36) PRIMARY KEY,
	class_start_time TIME,
    class_end_time TIME,
    class_course_code VARCHAR(20),
    class_name VARCHAR(255),
    class_runs_monday BOOLEAN,
    class_runs_tuesday BOOLEAN,
    class_runs_wednesday BOOLEAN,
    class_runs_thursday BOOLEAN,
    class_runs_friday BOOLEAN
) Engine=InnoDB;

CREATE TABLE common_class_work (
    id VARCHAR(36) PRIMARY KEY,
    class_id VARCHAR(36) NOT NULL,
    class_work_name VARCHAR(255) NOT NULL,
    class_work_end_date DATETIME,
    class_work_notes TEXT,
    FOREIGN KEY(class_id) REFERENCES common_class(id)
) Engine=InnoDB;

CREATE TABLE student (
	id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    discord_username VARCHAR(40) UNIQUE NOT NULL,
    salt VARCHAR(255) UNIQUE NOT NULL,
    home_location VARCHAR(100),
	school_location VARCHAR(100)
) Engine=InnoDB;

CREATE TABLE student_class (
	id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    class_time TIME DEFAULT NULL,
    class_location VARCHAR(20) DEFAULT NULL,
    class_midterm_date DATE DEFAULT NULL,
    class_exam_date DATE DEFAULT NULL,
    FOREIGN KEY(student_id) REFERENCES student(id)
) Engine=InnoDB;

CREATE TABLE student_class_work (
	id VARCHAR(36) PRIMARY KEY,
    student_class_id VARCHAR(36) NOT NULL,
    class_work_name VARCHAR(50),
    class_work_start_date DATETIME DEFAULT NULL,
    class_work_end_date DATETIME DEFAULT NULL,
    class_work_notes TEXT DEFAULT NULL,
    FOREIGN KEY(student_class_id) REFERENCES student_class(id)
) Engine=InnoDB;

DROP TABLE IF EXISTS common_class_work;
DROP TABLE IF EXISTS common_class;
DROP TABLE IF EXISTS student_class_work;
DROP TABLE IF EXISTS student_class;
DROP TABLE IF EXISTS student;