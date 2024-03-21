

CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    oauth_provider VARCHAR(255),
    oauth_user_id VARCHAR(255),
    oauth_user_info TEXT,
    access_token VARCHAR(255),
    refresh_token VARCHAR(255),
    token_expires_at DATETIME,
    role_id INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

CREATE TABLE IF NOT EXISTS Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO Roles (name) VALUES 
('User'),
('Manager'),
('Developer'),
('Admin');

docker run --name studentbot-mysql -e MYSQL_PASSWORD=studentbot123 -e MYSQL_USER=studentbot -e MYSQL_ROOT_PASSWORD=student_bot -e MYSQL_DATABASE=student_bot -p 3307:3306 -d mysql:latest
