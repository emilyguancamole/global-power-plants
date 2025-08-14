import { Router } from 'express';
import db from '../db/db';

const router = Router();

// List of all countries
router.get("/", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT DISTINCT country_code, country_name
            FROM countries
            ORDER BY country_name;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Country Power Generation Table: top 25 countries' generating capacity
router.get('/top25', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT c.country_code, c.country_name,
            SUM(p.capacity_mw) AS tot_capacity
            FROM countries c
            JOIN power_plants p
                ON c.country_code = p.country_code
            GROUP BY c.country_code, c.country_name
            ORDER BY tot_capacity DESC
            LIMIT 25` // groupby: calc SUM per country instead of all rows
        );
    
        res.json(result.rows) // sends as json
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' }); 
    }
});

// Country Electricity Generation Over Time: annual elec gen for the selected country code
router.get('/:code/generation-over-time', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await db.query(
            `SELECT g.year,
                SUM(COALESCE(generation_gwh, estimated_generation_gwh)) AS yearly_generation
            FROM generation_data g
            JOIN power_plants p
                ON g.gppd_idnr = p.gppd_idnr
            WHERE p.country_code = $1
            GROUP BY g.year
            ORDER BY g.year`,
            [code.toUpperCase()]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error getting generation data for country' });
    }
})


// todoUpdate feature: edit country's capacity_mw
// router.put('/:code/generation', async (req, res) => {
//     const { code } = req.params;
//     try {
//         const result = req.params.code;
//         const updatedData = req.body;

//         const county = await 
//     }
// })

// todoUpdate feature: edit county's generation_gwh_{year}


export default router;