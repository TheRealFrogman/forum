CREATE TABLE users (
   id BIGSERIAL PRIMARY KEY,
   username VARCHAR(30) CHECK(LENGTH(username) > 3 AND LENGTH(username) < 30 AND username ~ $$[A-Za-z0-9]$$) NOT NULL UNIQUE,
   hashed_password VARCHAR(255) CHECK(hashed_password ~ $$^.+:.+$$ AND LENGTH(hashed_password) > 8) NOT NULL,
   role TEXT CHECK(role IN ('regular', 'admin')) NOT NULL DEFAULT 'regular',
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
   email TEXT CHECK(email ~ $$^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$$),
   email_confirmed BOOLEAN DEFAULT FALSE
);

CREATE TABLE categories (
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(50) CHECK (LENGTH(name) > 3 AND LENGTH(name) < 20) NOT NULL UNIQUE
);

CREATE TABLE threads (
   id BIGSERIAL PRIMARY KEY,
   author_id BIGSERIAL NOT NULL,
   description TEXT CHECK(LENGTH(description) > 3 AND LENGTH(description) < 255) NOT NULL,
   title TEXT CHECK(LENGTH(title) > 20 AND LENGTH(title) < 2000) NOT NULL,
   rating INT DEFAULT 0 NOT NULL,
   FOREIGN KEY (author_id) REFERENCES users(id),
   category_id BIGSERIAL,
   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
   id BIGSERIAL PRIMARY KEY,
   content TEXT NOT NULL,
   thread_id BIGSERIAL NOT NULL,
   author_id BIGSERIAL NOT NULL,
   rating INT DEFAULT 0 NOT NULL,
   FOREIGN KEY (thread_id) REFERENCES threads(id),
   FOREIGN KEY (author_id) REFERENCES users(id),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
   id BIGSERIAL PRIMARY KEY,
   link VARCHAR(255),
   target_type VARCHAR(20) CHECK (target_type IN ('thread', 'comment')),
   target_id BIGSERIAL,
   FOREIGN KEY (target_id) REFERENCES threads(id) ON DELETE CASCADE,
   FOREIGN KEY (target_id) REFERENCES comments(id) ON DELETE CASCADE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thread_votes (
   user_id BIGSERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   thread_id BIGSERIAL NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
   vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (user_id, thread_id)
);

CREATE TABLE comment_votes (
   user_id BIGSERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   comment_id BIGSERIAL NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
   vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (user_id, comment_id)
);

CREATE VIEW threads_with_comments AS
SELECT
  t.*,
  (SELECT COUNT(*) FROM comments WHERE thread_id = t.id) AS comment_count
FROM threads t;