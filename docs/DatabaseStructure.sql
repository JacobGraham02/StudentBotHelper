CREATE DATABASE discord_student_helper_bot;
USE discord_student_helper_bot;

CREATE TABLE student (
	id VARCHAR(36) PRIMARY KEY,
    home_location VARCHAR(100) NULL,
	school_location VARCHAR(100) NULL
);

CREATE TABLE student_class (
	id VARCHAR(36) PRIMARY KEY,
    class_time TIME DEFAULT NULL,
    class_location VARCHAR(20) DEFAULT NULL,
    class_midterm_date DATE DEFAULT NULL,
    class_exam_date DATE DEFAULT NULL,
    FOREIGN KEY(id) REFERENCES student(id)
);

CREATE TABLE student_class_work (
	id VARCHAR(36) PRIMARY KEY,
    class_work_name VARCHAR(50) DEFAULT NULL,
    class_work_start_date DATETIME DEFAULT NULL,
    class_work_end_date DATETIME DEFAULT NULL,
    class_work_notes TEXT DEFAULT NULL,
    FOREIGN KEY(id) REFERENCES student_class(id)
);