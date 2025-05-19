require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require("path");

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(limiter);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use("/Images", express.static(path.join(__dirname, "Images")));
app.use("/static", express.static(path.join(__dirname, "public")));

// Database connection
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "project",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database successfully");
    connection.release();
});

// API Routes
app.get("/places", async (req, res) => {
    try {
        // First, check if the places table exists
        const [tables] = await promisePool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'project'
        `);
        
        const tableNames = tables.map(t => t.table_name);
        
        if (!tableNames.includes('places')) {
            return res.status(404).json({ error: "Places table not found" });
        }

        // If only places table exists, return just the places data
        if (!tableNames.includes('place_highlights') || !tableNames.includes('place_images')) {
            const [places] = await promisePool.query('SELECT * FROM places');
            return res.json(places.map(place => ({
                ...place,
                highlights: [],
                additional_images: []
            })));
        }

        // If all tables exist, return the full data
        const [places] = await promisePool.query(`
            SELECT p.*, 
                   GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
                   GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
            FROM places p
            LEFT JOIN place_highlights ph ON p.id = ph.place_id
            LEFT JOIN place_images pi ON p.id = pi.place_id
            GROUP BY p.id
        `);

        const processedPlaces = places.map(place => ({
            ...place,
            highlights: place.highlights ? place.highlights.split(',') : [],
            additional_images: place.additional_images ? place.additional_images.split(',') : []
        }));

        res.json(processedPlaces);
    } catch (error) {
        console.error("Error fetching places:", error);
        res.status(500).json({ error: "Failed to fetch places" });
    }
});

app.get("/places/:id", async (req, res) => {
    try {
        // First, check if the related tables exist
        const [tables] = await promisePool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'project'
        `);
        
        const tableNames = tables.map(t => t.table_name);
        
        if (!tableNames.includes('places')) {
            return res.status(404).json({ error: "Places table not found" });
        }

        // If only places table exists without related tables
        if (!tableNames.includes('place_highlights') || !tableNames.includes('place_images')) {
            const [place] = await promisePool.query('SELECT * FROM places WHERE id = ?', [req.params.id]);
            
            if (place.length === 0) {
                return res.status(404).json({ error: "Place not found" });
            }

            // Return single place with empty arrays for missing related data
            return res.json({
                ...place[0],
                highlights: [],
                additional_images: []
            });
        }

        // If all tables exist, return the full data with joins
        const [places] = await promisePool.query(`
            SELECT p.*, 
                   GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
                   GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
            FROM places p
            LEFT JOIN place_highlights ph ON p.id = ph.place_id
            LEFT JOIN place_images pi ON p.id = pi.place_id
            WHERE p.id = ?
            GROUP BY p.id
        `, [req.params.id]);

        if (places.length === 0) {
            return res.status(404).json({ error: "Place not found" });
        }

        // Process the place data to ensure properties are in the expected format
        const place = {
            ...places[0],
            highlights: places[0].highlights ? places[0].highlights.split(',') : [],
            additional_images: places[0].additional_images ? places[0].additional_images.split(',') : []
        };

        console.log('Sending place data:', place);
        res.json({ place: place }); // Wrap in 'place' property to match frontend expectation
    } catch (error) {
        console.error("Error fetching place:", error);
        res.status(500).json({ error: "Failed to fetch place details" });
    }
});

app.get("/places/search/:query", async (req, res) => {
    try {
        const searchQuery = `%${req.params.query}%`;
        const [places] = await promisePool.query(`
            SELECT p.*, 
                   GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
                   GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
            FROM places p
            LEFT JOIN place_highlights ph ON p.id = ph.place_id
            LEFT JOIN place_images pi ON p.id = pi.place_id
            WHERE p.name LIKE ? 
            OR p.description LIKE ? 
            OR p.category LIKE ? 
            OR p.city LIKE ?
            GROUP BY p.id
        `, [searchQuery, searchQuery, searchQuery, searchQuery]);

        const processedPlaces = places.map(place => ({
            ...place,
            highlights: place.highlights ? place.highlights.split(',') : [],
            additional_images: place.additional_images ? place.additional_images.split(',') : []
        }));

        res.json(processedPlaces);
    } catch (error) {
        console.error("Error searching places:", error);
        res.status(500).json({ error: "Failed to search places" });
    }
});

app.get("/places/category/:category", async (req, res) => {
    try {
        const [places] = await promisePool.query(`
            SELECT p.*, 
                   GROUP_CONCAT(DISTINCT ph.highlight) as highlights,
                   GROUP_CONCAT(DISTINCT pi.image_url) as additional_images
            FROM places p
            LEFT JOIN place_highlights ph ON p.id = ph.place_id
            LEFT JOIN place_images pi ON p.id = pi.place_id
            WHERE p.category = ?
            GROUP BY p.id
        `, [req.params.category]);

        const processedPlaces = places.map(place => ({
            ...place,
            highlights: place.highlights ? place.highlights.split(',') : [],
            additional_images: place.additional_images ? place.additional_images.split(',') : []
        }));

        res.json(processedPlaces);
    } catch (error) {
        console.error("Error fetching places by category:", error);
        res.status(500).json({ error: "Failed to fetch places by category" });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
