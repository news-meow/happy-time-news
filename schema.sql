DROP TABLE IF EXISTS articles;

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR (50),
    author VARCHAR (50),
    source VARCHAR (50),
    url VARCHAR (1000),
    image_url VARCHAR (1000),
    description VARCHAR (2000)
);