// require('dotenv').config();
// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const path = require("path");

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });

// const app = express();
// const port = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet());
// app.use(limiter);

// // Middleware
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Request logging middleware
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//     next();
// });

// // Built-in body parser middleware (no need for body-parser package)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files
// app.use("/Images", express.static(path.join(__dirname, "Images")));
// app.use("/static", express.static(path.join(__dirname, "public")));

// // Database connection from env variables
// const pool = mysql.createPool({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASS || "",
//     database: process.env.DB_NAME || "project",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // Convert pool to use promises
// const promisePool = pool.promise();

// // Test database connection
// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error("Database connection failed:", err);
//         process.exit(1);
//     }
//     console.log("Connected to MySQL database successfully");
//     connection.release();
// });

// // API Routes
// app.get("/places", async (req, res) => {
//     try {
//         const [tables] = await promisePool.query(`
//             SELECT table_name 
//             FROM information_schema.tables 
//             WHERE table_schema = ?
//         `, [process.env.DB_NAME || "project"]);

//         const tableNames = tables.map(t => t.table_name);

//         if (!tableNames.includes('places')) {
//             return res.status(404).json({ error: "Places table not found" });
//         }

//         if (!tableNames.includes('place_highlights') || !tableNames.includes('place_images')) {
//             const [places] = await promisePool.query('SELECT * FROM places');
//             return res.json(places.map(place => ({
//                 ...place,
//                 highlights: "",
//                 additional_images: []
//             })));
//         }

//         const [places] = await promisePool.query(`
//             SELECT p.*, 
//                    GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
//                    GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
//             FROM places p
//             LEFT JOIN place_highlights ph ON p.id = ph.place_id
//             LEFT JOIN place_images pi ON p.id = pi.place_id
//             GROUP BY p.id
//         `);

//         const processedPlaces = places.map(place => ({
//             ...place,
//             highlights: place.highlights || "",
//             additional_images: place.additional_images ? place.additional_images.split(',') : [],
//             rating: parseFloat(place.rating) || 0,
//             latitude: parseFloat(place.latitude) || 0,
//             longitude: parseFloat(place.longitude) || 0,
//             created_at: new Date(place.created_at)
//         }));

//         res.json(processedPlaces);
//     } catch (error) {
//         console.error("Error fetching places:", error);
//         res.status(500).json({ error: "Failed to fetch places" });
//     }
// });

// app.get("/places/:id", async (req, res) => {
//     try {
//         const [place] = await promisePool.query(`
//             SELECT p.*, 
//                    GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
//                    GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
//             FROM places p
//             LEFT JOIN place_highlights ph ON p.id = ph.place_id
//             LEFT JOIN place_images pi ON p.id = pi.place_id
//             WHERE p.id = ?
//             GROUP BY p.id
//         `, [req.params.id]);

//         if (place.length === 0) {
//             return res.status(404).json({ error: "Place not found" });
//         }

//         const formattedPlace = {
//             ...place[0],
//             highlights: place[0].highlights || "",
//             additional_images: place[0].additional_images ? place[0].additional_images.split(',') : [],
//             rating: parseFloat(place[0].rating) || 0,
//             latitude: parseFloat(place[0].latitude) || 0,
//             longitude: parseFloat(place[0].longitude) || 0,
//             created_at: new Date(place[0].created_at)
//         };

//         res.json(formattedPlace);
//     } catch (error) {
//         console.error("Error fetching place details:", error);
//         res.status(500).json({ error: "Failed to fetch place details" });
//     }
// });

// app.get("/places/search/:query", async (req, res) => {
//     try {
//         const searchQuery = `%${req.params.query}%`;
//         const [places] = await promisePool.query(`
//             SELECT p.*, 
//                    GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
//                    GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
//             FROM places p
//             LEFT JOIN place_highlights ph ON p.id = ph.place_id
//             LEFT JOIN place_images pi ON p.id = pi.place_id
//             WHERE p.name LIKE ? 
//             OR p.description LIKE ? 
//             OR p.category LIKE ? 
//             OR p.city LIKE ?
//             GROUP BY p.id
//         `, [searchQuery, searchQuery, searchQuery, searchQuery]);

//         const processedPlaces = places.map(place => ({
//             ...place,
//             highlights: place.highlights || "",
//             additional_images: place.additional_images ? place.additional_images.split(',') : [],
//             rating: parseFloat(place.rating) || 0,
//             latitude: parseFloat(place.latitude) || 0,
//             longitude: parseFloat(place.longitude) || 0,
//             created_at: new Date(place.created_at)
//         }));

//         res.json(processedPlaces);
//     } catch (error) {
//         console.error("Error searching places:", error);
//         res.status(500).json({ error: "Failed to search places" });
//     }
// });

// app.get("/places/category/:category", async (req, res) => {
//     try {
//         const [places] = await promisePool.query(`
//             SELECT p.*, 
//                    GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
//                    GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
//             FROM places p
//             LEFT JOIN place_highlights ph ON p.id = ph.place_id
//             LEFT JOIN place_images pi ON p.id = pi.place_id
//             WHERE p.category = ?
//             GROUP BY p.id
//         `, [req.params.category]);

//         const processedPlaces = places.map(place => ({
//             ...place,
//             highlights: place.highlights || "",
//             additional_images: place.additional_images ? place.additional_images.split(',') : [],
//             rating: parseFloat(place.rating) || 0,
//             latitude: parseFloat(place.latitude) || 0,
//             longitude: parseFloat(place.longitude) || 0,
//             created_at: new Date(place.created_at)
//         }));

//         res.json(processedPlaces);
//     } catch (error) {
//         console.error("Error fetching places by category:", error);
//         res.status(500).json({ error: "Failed to fetch places by category" });
//     }
// });

// app.get("/places/nearby", async (req, res) => {
//     try {
//         const { latitude, longitude, radius = 100 } = req.query;
        
//         console.log("Request received for nearby places:", { 
//             latitude, 
//             longitude, 
//             radius,
//             query: req.query 
//         });

//         if (!latitude || !longitude) {
//             console.log("Missing coordinates in request:", req.query);
//             return res.status(400).json({ error: "Latitude and longitude are required" });
//         }

//         // Convert to float for calculations
//         const lat = parseFloat(latitude);
//         const lng = parseFloat(longitude);
//         console.log("Parsed coordinates:", { lat, lng });

//         // Get the current place's ID to exclude it from results
//         const [currentPlace] = await promisePool.query(
//             'SELECT id, name, latitude, longitude FROM places WHERE latitude = ? AND longitude = ?',
//             [lat, lng]
//         );

//         if (!currentPlace[0]) {
//             console.log("Place not found for coordinates:", { lat, lng });
//             return res.status(404).json({ error: "Place not found" });
//         }

//         console.log("Current place:", currentPlace[0]);

//         // Calculate bounding box
//         const radiusInDegrees = radius / 111;
//         const minLat = lat - radiusInDegrees;
//         const maxLat = lat + radiusInDegrees;
//         const minLng = lng - radiusInDegrees;
//         const maxLng = lng + radiusInDegrees;

//         console.log("Bounding box:", { 
//             minLat, maxLat,
//             minLng, maxLng
//         });

//         const [places] = await promisePool.query(`
//             SELECT p.*, 
//                    GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
//                    GROUP_CONCAT(DISTINCT pi.image_url) as additional_images,
//                    6371 * 2 * ASIN(SQRT(
//                        POWER(SIN((RADIANS(?)-RADIANS(latitude))/2), 2) +
//                        COS(RADIANS(?)) * COS(RADIANS(latitude)) *
//                        POWER(SIN((RADIANS(?)-RADIANS(longitude))/2), 2)
//                    )) as distance
//             FROM places p
//             LEFT JOIN place_highlights ph ON p.id = ph.place_id
//             LEFT JOIN place_images pi ON p.id = pi.place_id
//             WHERE latitude BETWEEN ? AND ?
//             AND longitude BETWEEN ? AND ?
//             AND p.id != ?
//             GROUP BY p.id
//             HAVING distance <= ?
//             ORDER BY distance
//             LIMIT 6
//         `, [
//             lat, lat, lng,  // For distance calculation
//             minLat, maxLat, // Bounding box
//             minLng, maxLng,
//             currentPlace[0].id,
//             radius
//         ]);

//         console.log("Raw places query result:", places);

//         const processedPlaces = places.map(place => ({
//             ...place,
//             highlights: place.highlights || "",
//             additional_images: place.additional_images ? place.additional_images.split(',') : [],
//             rating: parseFloat(place.rating) || 0,
//             latitude: parseFloat(place.latitude) || 0,
//             longitude: parseFloat(place.longitude) || 0,
//             distance: parseFloat(place.distance) || 0,
//             created_at: new Date(place.created_at)
//         }));

//         console.log("Processed places:", processedPlaces);
//         res.json(processedPlaces);
//     } catch (error) {
//         console.error("Error fetching nearby places:", error);
//         console.error("Error details:", error.message);
//         res.status(500).json({ 
//             error: "Failed to fetch nearby places", 
//             details: error.message,
//             stack: error.stack 
//         });
//     }
// });

// // Single error handling middleware (must be last)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         error: 'Internal server error',
//         message: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


// require('dotenv').config();
// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const path = require("path");

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100
// });

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(helmet());
// app.use(limiter);

// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Query:`, req.query);
//     next();
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/Images", express.static(path.join(__dirname, "Images")));
// app.use("/static", express.static(path.join(__dirname, "public")));

// const pool = mysql.createPool({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASS || "",
//     database: process.env.DB_NAME || "project",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// const promisePool = pool.promise();

// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error("Database connection failed:", err);
//         process.exit(1);
//     }
//     console.log(`Connected to MySQL database: ${process.env.DB_NAME || "project"}`);
//     connection.release();
// });

// // API Routes - IMPORTANT: Order matters! Specific routes before parameterized routes

// app.get("/places", async (req, res) => {
//     try {
//         const [places] = await promisePool.query('SELECT * FROM places ORDER BY name');
//         console.log(`Fetched ${places.length} places from database`);

//         const processedPlaces = places.map(place => ({
//             ...place,
//             highlights: place.highlights ? JSON.parse(place.highlights) : [],
//             rating: parseFloat(place.rating) || 0,
//             latitude: parseFloat(place.latitude) || 0,
//             longitude: parseFloat(place.longitude) || 0,
//             created_at: place.created_at ? new Date(place.created_at).toISOString() : null
//         }));

//         res.json(processedPlaces);
//     } catch (error) {
//         console.error("Error fetching places:", error.message);
//         res.status(500).json({ error: "Failed to fetch places", details: error.message });
//     }
// });

// app.get("/places/nearby", async (req, res) => {
//     console.log("=== NEARBY PLACES ENDPOINT HIT ===");
//     console.log("Query params:", req.query);
    
//     try {
//         const { latitude, longitude, radius = 100 } = req.query;
        
//         if (!latitude || !longitude) {
//             console.log("Missing coordinates");
//             return res.status(400).json({ 
//                 error: "Latitude and longitude are required",
//                 received: { latitude, longitude }
//             });
//         }

//         const lat = parseFloat(latitude);
//         const lng = parseFloat(longitude);
//         const rad = parseFloat(radius);
        
//         console.log("Parsed coordinates:", { lat, lng, rad });
        
//         if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
//             console.log("Invalid coordinates");
//             return res.status(400).json({ 
//                 error: "Invalid coordinates",
//                 received: { latitude, longitude, radius }
//             });
//         }

//         if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
//             return res.status(400).json({ error: "Coordinates out of valid range" });
//         }

//         console.log("Executing database query...");
        
//         const [places] = await promisePool.query(`
//             SELECT *,
//                 (6371 * acos(
//                     cos(radians(?)) * cos(radians(latitude)) *
//                     cos(radians(longitude) - radians(?)) +
//                     sin(radians(?)) * sin(radians(latitude))
//                 )) AS distance
//             FROM places
//             WHERE latitude IS NOT NULL
//             AND longitude IS NOT NULL
//             AND latitude != 0
//             AND longitude != 0
//             HAVING distance < ?
//             ORDER BY distance
//             LIMIT 20
//         `, [lat, lng, lat, rad]);

//         console.log(`Database returned ${places.length} places`);
        
//         if (places.length === 0) {
//             console.log("No places found in radius");
//             return res.json([]);
//         }

//         const processedPlaces = places.map(place => {
//             const processed = {
//                 ...place,
//                 highlights: place.highlights ? JSON.parse(place.highlights) : [],
//                 rating: parseFloat(place.rating) || 0,
//                 latitude: parseFloat(place.latitude) || 0,
//                 longitude: parseFloat(place.longitude) || 0,
//                 distance: parseFloat(place.distance) || 0,
//                 created_at: place.created_at ? new Date(place.created_at).toISOString() : null
//             };
//             console.log(`Place: ${processed.name}, Distance: ${processed.distance.toFixed(2)}km`);
//             return processed;
//         });

//         console.log("=== NEARBY PLACES SUCCESS ===");
//         res.json(processedPlaces);
        
//     } catch (error) {
//         console.error("=== NEARBY PLACES ERROR ===");
//         console.error("Error details:", error);
//         res.status(500).json({ 
//             error: "Failed to fetch nearby places", 
//             details: error.message,
//             stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//         });
//     }
// });

// app.get("/places/search/:query", async (req, res) => {
//     try {
//         const searchQuery = `%${req.params.query}%`;
//         const [places] = await promisePool.query(`
//             SELECT * FROM places
//             WHERE name LIKE ? 
//             OR description LIKE ? 
//             OR category LIKE ? 
//             OR location LIKE ?
//             ORDER BY name
//         `, [searchQuery, searchQuery, searchQuery, searchQuery]);

//         console.log(`Search results: ${places.length} places`);
//         const processedPlaces = places.map(place => ({
//             ...place,
//             highlights: place.highlights ? JSON.parse(place.highlights) : [],
//             rating: parseFloat(place.rating) || 0,
//             latitude: parseFloat(place.latitude) || 0,
//             longitude: parseFloat(place.longitude) || 0,
//             created_at: place.created_at ? new Date(place.created_at).toISOString() : null
//         }));

//         res.json(processedPlaces);
//     } catch (error) {
//         console.error("Error searching places:", error.message);
//         res.status(500).json({ error: "Failed to search places", details: error.message });
//     }
// });

// // Get places by category
// app.get("/places/category/:category", async (req, res) => {
//     try {
//         const [places] = await promisePool.query(
//             'SELECT * FROM places WHERE category = ? ORDER BY name', 
//             [req.params.category]
//         );
//         console.log(`Category results: ${places.length} places`);

//         const processedPlaces = places.map(place => ({
//             ...place,
//             highlights: place.highlights ? JSON.parse(place.highlights) : [],
//             rating: parseFloat(place.rating) || 0,
//             latitude: parseFloat(place.latitude) || 0,
//             longitude: parseFloat(place.longitude) || 0,
//             created_at: place.created_at ? new Date(place.created_at).toISOString() : null
//         }));

//         res.json(processedPlaces);
//     } catch (error) {
//         console.error("Error fetching places by category:", error.message);
//         res.status(500).json({ error: "Failed to fetch places by category", details: error.message });
//     }
// });

// // Get single place by ID - MUST come after specific routes
// app.get("/places/:id", async (req, res) => {
//     try {
//         console.log(`Fetching place with ID: ${req.params.id}`);
//         const [place] = await promisePool.query('SELECT * FROM places WHERE id = ?', [req.params.id]);
        
//         if (place.length === 0) {
//             console.log(`Place with ID ${req.params.id} not found`);
//             return res.status(404).json({ error: "Place not found" });
//         }

//         const formattedPlace = {
//             ...place[0],
//             highlights: place[0].highlights ? JSON.parse(place[0].highlights) : [],
//             rating: parseFloat(place[0].rating) || 0,
//             latitude: parseFloat(place[0].latitude) || 0,
//             longitude: parseFloat(place[0].longitude) || 0,
//             created_at: place[0].created_at ? new Date(place[0].created_at).toISOString() : null
//         };

//         console.log(`Place found: ${formattedPlace.name} at ${formattedPlace.latitude}, ${formattedPlace.longitude}`);
//         res.json(formattedPlace);
//     } catch (error) {
//         console.error("Error fetching place details:", error.message);
//         res.status(500).json({ error: "Failed to fetch place details", details: error.message });
//     }
// });

// // Test endpoint to verify API is working
// app.get("/test", (req, res) => {
//     res.json({ 
//         message: "API is working", 
//         timestamp: new Date().toISOString(),
//         routes: [
//             "GET /places",
//             "GET /places/nearby",
//             "GET /places/search/:query", 
//             "GET /places/category/:category",
//             "GET /places/:id"
//         ]
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error("Server error:", err.stack);
//     res.status(500).json({
//         error: 'Internal server error',
//         message: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     console.log(`404 - Route not found: ${req.method} ${req.url}`);
//     res.status(404).json({ error: 'Route not found' });
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//     console.log(`Test the API at: http://localhost:${port}/test`);
// });



require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

const app = express();
const port = process.env.PORT || 5000;

// Security + middlewares
app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/Images", express.static(path.join(__dirname, "Images")));
app.use("/static", express.static(path.join(__dirname, "public")));

// MySQL pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "project",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const promisePool = pool.promise();

// Test DB connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log(`Connected to MySQL database: ${process.env.DB_NAME || "project"}`);
    connection.release();
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });
        req.user = decoded;
        next();
    });
};

////////////////////////////////////////////////////
// 🔹 AUTH ROUTES
////////////////////////////////////////////////////

// REGISTER
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const [existing] = await promisePool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await promisePool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        res.json({ success: true, message: "Registration successful" });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const [users] = await promisePool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

////////////////////////////////////////////////////
// 🔹 PLACES ROUTES (protected with JWT)
////////////////////////////////////////////////////

app.get("/places", verifyToken, async (req, res) => {
    try {
        const [places] = await promisePool.query("SELECT * FROM places ORDER BY name");
        const processed = places.map(p => ({
            ...p,
            highlights: p.highlights ? JSON.parse(p.highlights) : [],
            rating: parseFloat(p.rating) || 0,
            latitude: parseFloat(p.latitude) || 0,
            longitude: parseFloat(p.longitude) || 0,
            created_at: p.created_at ? new Date(p.created_at).toISOString() : null
        }));
        res.json(processed);
    } catch (error) {
        console.error("Error fetching places:", error.message);
        res.status(500).json({ error: "Failed to fetch places" });
    }
});

// Nearby places
app.get("/places/nearby", verifyToken, async (req, res) => {
    try {
        const { latitude, longitude, radius = 100 } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and longitude are required" });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const rad = parseFloat(radius);

        const [places] = await promisePool.query(`
            SELECT *,
                (6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitude))
                )) AS distance
            FROM places
            HAVING distance < ?
            ORDER BY distance
            LIMIT 20
        `, [lat, lng, lat, rad]);

        const processed = places.map(p => ({
            ...p,
            highlights: p.highlights ? JSON.parse(p.highlights) : [],
            rating: parseFloat(p.rating) || 0,
            latitude: parseFloat(p.latitude) || 0,
            longitude: parseFloat(p.longitude) || 0,
            distance: parseFloat(p.distance) || 0,
            created_at: p.created_at ? new Date(p.created_at).toISOString() : null
        }));

        res.json(processed);
    } catch (error) {
        console.error("Nearby error:", error.message);
        res.status(500).json({ error: "Failed to fetch nearby places" });
    }
});

// Search places
app.get("/places/search/:query", verifyToken, async (req, res) => {
    try {
        const search = `%${req.params.query}%`;
        const [places] = await promisePool.query(`
            SELECT * FROM places
            WHERE name LIKE ? OR description LIKE ? OR category LIKE ? OR location LIKE ?
            ORDER BY name
        `, [search, search, search, search]);

        const processed = places.map(p => ({
            ...p,
            highlights: p.highlights ? JSON.parse(p.highlights) : [],
            rating: parseFloat(p.rating) || 0,
            latitude: parseFloat(p.latitude) || 0,
            longitude: parseFloat(p.longitude) || 0,
            created_at: p.created_at ? new Date(p.created_at).toISOString() : null
        }));

        res.json(processed);
    } catch (error) {
        res.status(500).json({ error: "Failed to search places" });
    }
});

// Places by category
app.get("/places/category/:category", verifyToken, async (req, res) => {
    try {
        const [places] = await promisePool.query("SELECT * FROM places WHERE category = ? ORDER BY name", [req.params.category]);
        const processed = places.map(p => ({
            ...p,
            highlights: p.highlights ? JSON.parse(p.highlights) : [],
            rating: parseFloat(p.rating) || 0,
            latitude: parseFloat(p.latitude) || 0,
            longitude: parseFloat(p.longitude) || 0,
            created_at: p.created_at ? new Date(p.created_at).toISOString() : null
        }));
        res.json(processed);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch category places" });
    }
});

// Single place
app.get("/places/:id", verifyToken, async (req, res) => {
    try {
        const [place] = await promisePool.query("SELECT * FROM places WHERE id = ?", [req.params.id]);
        if (place.length === 0) return res.status(404).json({ error: "Place not found" });

        const p = place[0];
        res.json({
            ...p,
            highlights: p.highlights ? JSON.parse(p.highlights) : [],
            rating: parseFloat(p.rating) || 0,
            latitude: parseFloat(p.latitude) || 0,
            longitude: parseFloat(p.longitude) || 0,
            created_at: p.created_at ? new Date(p.created_at).toISOString() : null
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch place details" });
    }
});

// Test route
app.get("/test", (req, res) => {
    res.json({ 
        message: "API is working", 
        timestamp: new Date().toISOString(),
        routes: [
            "POST /register",
            "POST /login",
            "GET /places (protected)",
            "GET /places/nearby (protected)",
            "GET /places/search/:query (protected)",
            "GET /places/category/:category (protected)",
            "GET /places/:id (protected)"
        ]
    });
});

app.get("/profile", verifyToken, async (req, res) => {
    try {
        const [users] = await promisePool.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});


// UPDATE PROFILE
app.put("/profile", verifyToken, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        // Build query dynamically
        let query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        let values = [name, email, req.user.id];

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
            values = [name, email, hashedPassword, req.user.id];
        }

        const [result] = await promisePool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found or no changes made" });
        }

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update profile error:", error.message);
        res.status(500).json({ error: "Failed to update profile" });
    }
});



// Error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err.stack);
    res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🔗 Test API: http://localhost:${port}/test`);
});
