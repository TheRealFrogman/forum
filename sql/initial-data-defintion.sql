CREATE TABLE users (
   id BIGSERIAL PRIMARY KEY,
   username VARCHAR(30) CHECK(LENGTH(username) > 3 AND LENGTH(username) < 30 AND username ~ $$[A-Za-z0-9]$$) NOT NULL UNIQUE,
   hashed_password VARCHAR(255) CHECK(hashed_password ~ $$^.+:.+$$ AND LENGTH(hashed_password) > 8) NOT NULL,
   role TEXT CHECK(role IN ('regular', 'admin')) NOT NULL DEFAULT 'regular',
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
   email TEXT CHECK(email ~ $$^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$$),
   email_confirmed BOOLEAN DEFAULT FALSE
);

CREATE TABLE threads (
   id BIGSERIAL PRIMARY KEY,
   author_id BIGSERIAL NOT NULL,
   description TEXT CHECK(LENGTH(description) > 3 AND LENGTH(description) < 255) NOT NULL,
   title TEXT CHECK(LENGTH(title) > 3 AND LENGTH(title) < 255) NOT NULL,
   FOREIGN KEY (author_id) REFERENCES users(id),
   category_id BIGSERIAL,
   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
);

CREATE TABLE comments (
   id BIGSERIAL PRIMARY KEY,
   content TEXT NOT NULL,
   thread_id BIGSERIAL NOT NULL,
   author_id BIGSERIAL NOT NULL,
   rating INT DEFAULT 0 NOT NULL,
   FOREIGN KEY (thread_id) REFERENCES threads(id),
   FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE photos (
   id BIGSERIAL PRIMARY KEY,
   link VARCHAR(255),
   target_type VARCHAR(20) CHECK (target_type IN ('thread', 'comment')),
   target_id BIGSERIAL,
   FOREIGN KEY (target_id) REFERENCES threads(id) ON DELETE CASCADE,
   FOREIGN KEY (target_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE categories (
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(50) CHECK (LENGTH(name) > 3 AND LENGTH(name) < 20) NOT NULL
)