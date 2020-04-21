DROP TABLE IF EXISTS articles;

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR (250),
    author VARCHAR (250),
    source VARCHAR (250),
    url VARCHAR (1000),
    image_url VARCHAR (1000),
    description VARCHAR (2000)
);