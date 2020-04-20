DROP TABLE IF EXISTS articles;

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR (50),
    author VARCHAR (50)
);