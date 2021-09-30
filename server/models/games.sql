CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    white_username VARCHAR(50) NOT NULL,
    black_username VARCHAR(50) NOT NULL,
    minutes INT NOT NULL,
    seconds INT NOT NULL,
    white_time_left INT,
    black_time_left INT,
    created_on TIMESTAMP DEFAULT NOW(),
    finished TIMESTAMP,
    result BOOLEAN,
    FOREIGN KEY(white_username) REFERENCES users(username),
    FOREIGN KEY(black_username) REFERENCES users(username)
);