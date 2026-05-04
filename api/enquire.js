const db = require('../database');

const allowCors = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
};

module.exports = async (req, res) => {
    allowCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, phone, email, requirement, budget, location, message, property_interest } = body || {};

    const sql = `INSERT INTO enquiries (name, phone, email, requirement, budget, location, message, property_interest) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, phone, email, requirement, budget, location, message, property_interest];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Failed to save enquiry:', err.message);
            return res.status(500).json({ error: 'Failed to save enquiry' });
        }

        return res.status(200).json({ success: true, message: 'Enquiry saved successfully', id: this.lastID });
    });
};
