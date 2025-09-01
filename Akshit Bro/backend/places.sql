CREATE DATABASE IF NOT EXISTS project;
USE project;

DROP TABLE IF EXISTS places;

CREATE TABLE places (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(100),
  image_url VARCHAR(255),
  location VARCHAR(255),
  rating DECIMAL(2,1),
  description TEXT,
  highlights TEXT,
  best_time_to_visit TEXT,
  how_to_reach TEXT,
  entry_fee VARCHAR(100),
  timings TEXT,
  latitude DECIMAL(8,4),
  longitude DECIMAL(8,4),
  district VARCHAR(100),
  city VARCHAR(100),
  created_at DATETIME
);
