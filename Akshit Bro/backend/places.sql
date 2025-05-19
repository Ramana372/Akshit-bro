-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS project;
USE project;

-- Create the places table
CREATE TABLE IF NOT EXISTS places (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    city VARCHAR(100),
    location VARCHAR(255),
    image_url VARCHAR(255),
    rating DECIMAL(3,1),
    best_time_to_visit TEXT,
    how_to_reach TEXT,
    entry_fee VARCHAR(100),
    timings VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the place_highlights table
CREATE TABLE IF NOT EXISTS place_highlights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    place_id INT NOT NULL,
    highlight TEXT,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
    -- Optional: Add unique constraint to avoid duplicate highlights
    -- , UNIQUE (place_id, highlight)
);

-- Create the place_images table
CREATE TABLE IF NOT EXISTS place_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    place_id INT NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);

-- Insert places data
INSERT IGNORE INTO places (id, name, description, category, city, location, image_url, rating) VALUES
(1, '1000 Pillars Temple', 'An ancient temple with rich architecture.', 'Temples', 'Warangal', 'Warangal Fort Area', '/Images/1000pillerstemple.jpg', 4.50),
(2, 'Horsley Hills', 'A beautiful hill station with scenic views.', 'Hills', 'Andhra Pradesh', 'Madanapalle', '/Images/Horsely_hills.jpg', 4.20),
(3, 'Thalakona Waterfalls', 'The highest waterfall in Andhra Pradesh.', 'Waterfalls', 'Chittoor', 'Tirupati', '/Images/Thalakona waterfalls.jpg', 4.60),
(4, 'Warangal Fort', 'An ancient fort with historical significance.', 'Forts', 'Warangal', 'Warangal City', '/Images/Warangal Fort.jpg', 4.40),
(5, 'Lepakshi Temple', 'Ancient temple known for its hanging pillar.', 'Temples', 'Lepakshi', 'Lepakshi Village', '/Images/Lepakshi Temple.jpg', 4.70),
(6, 'Ramappa Temple', 'UNESCO World Heritage site with unique architecture.', 'Temples', 'Warangal', 'Palampet', '/Images/Ramappa temple.jpg', 4.80),
(7, 'Chandaragiri Fort', 'Historic fort with panoramic views.', 'Forts', 'Chandragiri', 'Tirupati', '/Images/Chandaragiri_fort.jpg', 4.30),
(8, 'Gudisa Hill Station', 'Scenic hill station with beautiful landscapes.', 'Hills', 'Gudisa', 'Gudisa Village', '/Images/Gudisa_hill_station.jpg', 4.50),
(9, 'Kapila Theertham Waterfalls', 'Sacred waterfall near Tirupati.', 'Waterfalls', 'Tirupati', 'Tirupati Hills', '/Images/Kapila therdham water falls.jpg', 4.40),
(10, 'Laknavaram Lake Bridge', 'Beautiful lake with a unique bridge.', 'Lakes', 'Warangal', 'Laknavaram', '/Images/Laknavaram lake bridge.jpg', 4.60),
(11, 'Maredumilli', 'Eco-tourism destination with rich biodiversity.', 'Forests', 'East Godavari', 'Maredumilli', '/Images/mardumilli.jpg', 4.50),
(12, 'Lambasingi', 'Known as the Kashmir of Andhra Pradesh.', 'Hills', 'Visakhapatnam', 'Lambasingi', '/Images/Lambasingi.jpg', 4.70),
(13, 'Kothapalli Waterfalls', 'Scenic waterfall in a natural setting.', 'Waterfalls', 'Kothapalli', 'Kothapalli Village', '/Images/Kothapalli-waterfalls.jpg', 4.30),
(14, 'Ponguleru Vaagu', 'Beautiful water stream in a natural setting.', 'Waterfalls', 'Warangal', 'Ponguleru', '/Images/Ponguleru vaagu.jpg', 4.40),
(15, 'Armakonda Peak', 'Scenic peak with panoramic views.', 'Hills', 'Warangal', 'Armakonda', '/Images/Armakonda_peak.jpg', 4.50),
(16, 'Tonkota Waterfalls', 'Picturesque waterfall in a serene environment.', 'Waterfalls', 'Tonkota', 'Tonkota Village', '/Images/tonkota waterfalls.jpg', 4.40),
(17, 'Seetaramachandraswami Temple', 'Ancient temple with rich heritage.', 'Temples', 'Samshabad', 'Samshabad', '/Images/Seetaramachandraswami Temple, Samshabad.jpg', 4.60),
(18, 'Tribal Village', 'Traditional tribal village near Armakonda.', 'Villages', 'Warangal', 'Armakonda', '/Images/Tribal village near armakonda.jpg', 4.30);

-- Insert highlights
INSERT IGNORE INTO place_highlights (place_id, highlight) VALUES
(1, 'Ancient Architecture'), (1, '1000 Pillars'), (1, 'Historical Significance'),
(2, 'Scenic Views'), (2, 'Hill Station'), (2, 'Nature Trails'),
(3, 'Highest Waterfall'), (3, 'Natural Beauty'), (3, 'Trekking Spots'),
(4, 'Historical Fort'), (4, 'Ancient Architecture'), (4, 'Panoramic Views'),
(5, 'Hanging Pillar'), (5, 'Ancient Temple'), (5, 'Architectural Marvel'),
(6, 'UNESCO Heritage'), (6, 'Unique Architecture'), (6, 'Historical Significance'),
(7, 'Historic Fort'), (7, 'Panoramic Views'), (7, 'Ancient Architecture'),
(8, 'Scenic Beauty'), (8, 'Hill Station'), (8, 'Nature Trails'),
(9, 'Sacred Waterfall'), (9, 'Natural Beauty'), (9, 'Religious Significance'),
(10, 'Lake View'), (10, 'Unique Bridge'), (10, 'Scenic Beauty'),
(11, 'Eco Tourism'), (11, 'Biodiversity'), (11, 'Nature Trails'),
(12, 'Kashmir of AP'), (12, 'Hill Station'), (12, 'Scenic Views'),
(13, 'Natural Waterfall'), (13, 'Scenic Beauty'), (13, 'Trekking Spots'),
(14, 'Water Stream'), (14, 'Natural Beauty'), (14, 'Scenic Views'),
(15, 'Panoramic Views'), (15, 'Peak Trekking'), (15, 'Scenic Beauty'),
(16, 'Picturesque Waterfall'), (16, 'Natural Beauty'), (16, 'Serene Environment'),
(17, 'Ancient Temple'), (17, 'Rich Heritage'), (17, 'Historical Significance'),
(18, 'Traditional Village'), (18, 'Cultural Experience'), (18, 'Tribal Life');

-- Insert additional images
INSERT IGNORE INTO place_images (place_id, image_url) VALUES
(1, '/Images/1000pillerstemple_2.jpg'), (1, '/Images/1000pillerstemple_3.jpg'),
(2, '/Images/Horsely_hills_2.jpg'), (2, '/Images/Horsely_hills_3.jpg'),
(3, '/Images/Thalakona_waterfalls_2.jpg'), (3, '/Images/Thalakona_waterfalls_3.jpg'),
(4, '/Images/Warangal_Fort_2.jpg'), (4, '/Images/Warangal_Fort_3.jpg'),
(5, '/Images/Lepakshi_Temple_2.jpg'), (5, '/Images/Lepakshi_Temple_3.jpg'),
(6, '/Images/Ramappa_temple_2.jpg'), (6, '/Images/Ramappa_temple_3.jpg'),
(7, '/Images/Chandaragiri_fort_2.jpg'), (7, '/Images/Chandaragiri_fort_3.jpg'),
(8, '/Images/Gudisa_hill_station_2.jpg'), (8, '/Images/Gudisa_hill_station_3.jpg'),
(9, '/Images/Kapila_therdham_waterfalls_2.jpg'), (9, '/Images/Kapila_therdham_waterfalls_3.jpg'),
(10, '/Images/Laknavaram_lake_bridge_2.jpg'), (10, '/Images/Laknavaram_lake_bridge_3.jpg'),
(11, '/Images/mardumilli_2.jpg'), (11, '/Images/mardumilli_3.jpg'),
(12, '/Images/Lambasingi_2.jpg'), (12, '/Images/Lambasingi_3.jpg'),
(13, '/Images/Kothapalli_waterfalls_2.jpg'), (13, '/Images/Kothapalli_waterfalls_3.jpg'),
(14, '/Images/Ponguleru_vaagu_2.jpg'), (14, '/Images/Ponguleru_vaagu_3.jpg'),
(15, '/Images/Armakonda_peak_2.jpg'), (15, '/Images/Armakonda_peak_3.jpg'),
(16, '/Images/tonkota_waterfalls_2.jpg'), (16, '/Images/tonkota_waterfalls_3.jpg'),
(17, '/Images/Seetaramachandraswami_Temple_2.jpg'), (17, '/Images/Seetaramachandraswami_Temple_3.jpg'),
(18, '/Images/Tribal_village_2.jpg'), (18, '/Images/Tribal_village_3.jpg');
