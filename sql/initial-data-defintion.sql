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
   name VARCHAR(50) CHECK (LENGTH(name) > 0 AND LENGTH(name) < 20) NOT NULL UNIQUE
);

CREATE TABLE threads (
   id BIGSERIAL PRIMARY KEY,
   author_id BIGINT NOT NULL REFERENCES users(id),
   category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
   title TEXT CHECK(LENGTH(title) > 6 AND LENGTH(title) < 2000) NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   comment_count INT DEFAULT 0
);

CREATE INDEX author_id_index ON threads (author_id);
CREATE INDEX category_id_index ON threads (category_id);

CREATE TABLE comments (
   id BIGSERIAL PRIMARY KEY,
   content TEXT CHECK(LENGTH(description) > 3 AND LENGTH(description) < 255) NOT NULL,
   thread_id BIGSERIAL NOT NULL,
   author_id BIGSERIAL NOT NULL,
   FOREIGN KEY (thread_id) REFERENCES threads(id),
   FOREIGN KEY (author_id) REFERENCES users(id),
   rating INT DEFAULT 0 NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX thread_id_index ON comments (thread_id);
CREATE INDEX author_id_index ON comments (author_id);

CREATE TABLE photos (
   id BIGSERIAL PRIMARY KEY,
   link VARCHAR(255),
   target_type VARCHAR(20) CHECK (target_type IN ('thread', 'comment')),
   target_id BIGINT,
   FOREIGN KEY (target_id) REFERENCES threads(id) ON DELETE CASCADE,
   FOREIGN KEY (target_id) REFERENCES comments(id) ON DELETE CASCADE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
   vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (user_id, comment_id)
);

CREATE INDEX user_id_index ON votes (user_id);
CREATE INDEX comment_id_index ON votes (comment_id);

CREATE OR REPLACE FUNCTION update_comment_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE comments SET rating = rating + 1 WHERE id = NEW.comment_id;
    ELSIF NEW.vote_type = 'downvote' THEN
      UPDATE comments SET rating = rating - 1 WHERE id = NEW.comment_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_rating_trigger
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE PROCEDURE update_comment_rating();


CREATE OR REPLACE FUNCTION increment_thread_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads SET comment_count = comment_count + 1 WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_comment_count_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE PROCEDURE increment_thread_comment_count();

CREATE OR REPLACE FUNCTION decrement_thread_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads SET comment_count = comment_count - 1 WHERE id = OLD.thread_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_comment_count_trigger
BEFORE DELETE ON comments
FOR EACH ROW
EXECUTE PROCEDURE decrement_thread_comment_count();