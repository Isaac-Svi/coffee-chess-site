CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    token_version INT NOT NULL DEFAULT 0,
    created_on TIMESTAMP DEFAULT NOW()
);