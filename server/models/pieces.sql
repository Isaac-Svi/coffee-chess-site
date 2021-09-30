CREATE TABLE pieces (
    piece_id SERIAL PRIMARY KEY,
    type CHAR(1) NOT NULL,
    color CHAR(1) NOT NULL
);