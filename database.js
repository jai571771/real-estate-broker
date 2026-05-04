const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database (this will create leads.db if it doesn't exist)
const dbPath = path.resolve(__dirname, 'leads.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the enquiries table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        requirement TEXT,
        budget TEXT,
        location TEXT,
        message TEXT,
        property_interest TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Enquiries table ready.');
        }
    });
});

module.exports = db;
