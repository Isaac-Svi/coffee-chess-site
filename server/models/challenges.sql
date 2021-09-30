CREATE TABLE challenges (
    challenge_id SERIAL PRIMARY KEY,
    challenger_username VARCHAR(50) UNIQUE NOT NULL,
    challenger_side CHAR(1) NOT NULL,
    accepter_side CHAR(1),
    minutes INT NOT NULL,
    seconds INT NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(challenger_username) REFERENCES users(username)
);