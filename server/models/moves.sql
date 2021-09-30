CREATE TABLE moves (
    move_id SERIAL,
    piece_id SMALLINT REFERENCES pieces(piece_id),
    row SMALLINT NOT NULL,
    col CHAR(1) NOT NULL,
    isRemoved BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(move_id, piece_id)
);