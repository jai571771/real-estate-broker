const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const isVercel = Boolean(process.env.VERCEL);
const dbFileName = 'leads.db';
const localDbPath = path.resolve(__dirname, dbFileName);
const dbPath = isVercel
    ? path.join('/tmp', dbFileName)
    : localDbPath;

if (isVercel) {
    try {
        if (!fs.existsSync(dbPath)) {
            if (fs.existsSync(localDbPath)) {
                fs.copyFileSync(localDbPath, dbPath);
            } else {
                fs.writeFileSync(dbPath, '');
            }
        }
    } catch (err) {
        console.error('Error preparing SQLite database on Vercel:', err.message);
    }
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.', dbPath);
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
