const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// API Endpoint to save an enquiry
app.post('/api/enquire', (req, res) => {
    const { name, phone, email, requirement, budget, location, message, property_interest } = req.body;
    
    const sql = `INSERT INTO enquiries (name, phone, email, requirement, budget, location, message, property_interest) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [name, phone, email, requirement, budget, location, message, property_interest];
    
    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to save enquiry' });
            return;
        }
        res.status(200).json({ 
            success: true, 
            message: 'Enquiry saved successfully', 
            id: this.lastID 
        });
    });
});

// Optional Admin API Endpoint to view all leads
app.get('/api/leads', (req, res) => {
    db.all(`SELECT * FROM enquiries ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch leads' });
            return;
        }
        res.status(200).json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
