import { Router } from 'express';
import db from '../db';

const router = Router();

// Global Power Plant Map: locations of plants, primary fuel type, generating capacity
router.get('/coordinates', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT gppd_idnr, latitude, longitude, primary_fuel, capacity_mw
            FROM power_plants;`
        );
        res.json(result.rows) // sends as json
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' }); 
    }
});

// Global Primary Fuel Pie Chart
router.get('/fuel-share', async (req, res) => {
    try{
        const result = await db.query(
            `SELECT primary_fuel,
                SUM(capacity_mw) AS tot_capacity
            FROM power_plants
            GROUP BY primary_fuel
            ORDER BY tot_capacity DESC;`
        )
        res.json(result.rows)
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error getting pie chart data' });
    }
});

export default router;
