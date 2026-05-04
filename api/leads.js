const db = require('../database');

const allowCors = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
};

module.exports = async (req, res) => {
    allowCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    db.all('SELECT * FROM enquiries ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Failed to fetch leads:', err.message);
            return res.status(500).json({ error: 'Failed to fetch leads' });
        }
        return res.status(200).json(rows);
    });
};
