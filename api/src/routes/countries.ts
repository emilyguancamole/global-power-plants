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
    // Compute the baseline total capacity from power_plants
    // Check if a country-level override in country_capacity_overrides.
    // Return the effective capacity (COALESCE(override, sum)).
    
router.get('/top25', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                c.country_code, 
                c.country_name,
                SUM(p.capacity_mw) AS base_tot_capacity,
                co.capacity_override_mw,
                COALESCE(co.capacity_override_mw, SUM(p.capacity_mw)) as tot_capacity
            FROM countries c
            JOIN power_plants p
                ON c.country_code = p.country_code
            LEFT JOIN country_capacity_overrides co
                ON c.country_code = co.country_code

            GROUP BY c.country_code, c.country_name, co.capacity_override_mw
            ORDER BY tot_capacity DESC
            LIMIT 25` // group by: SUM per country instead of all rows
                            // if SELECT something that isn’t inside an aggregate, it must appear in GROUP BY.
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
        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No data found for country code ${code}` });
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error editing generation data for country ${code}` });
    }
})


//todo Update feature: edit country's capacity_mw
router.patch('/:code/capacity-mw', async (req, res) => {
    const { code } = req.params;
    const { capacity } = req.body;

    // capacity = null means remove override
    if (capacity !== null && (capacity === undefined || typeof capacity !== 'number' || capacity < 0)) {
        return res.status(400).json({ error: "Capacity must be a non-negative number or null" });
    }

    try {
        if (capacity === null) { // remove the override
            const deleted = await db.query(
                `DELETE FROM country_capacity_overrides
                WHERE country_code = $1
                RETURNING country_code;`,
                [code.toUpperCase()]
            );
            if (deleted.rows.length === 0) {
                return res.status(404).json({ error: `No override found for country code ${code}` });
            }
            return res.json({ message: `Override removed for ${code.toUpperCase()}` });
        }
        
        // Upsert the override //* upset: INSERT ... ON CONFLICT DO UPDATE
        const result = await db.query(
            `INSERT INTO country_capacity_overrides (country_code, capacity_override_mw)
            VALUES ($1, $2)
            ON CONFLICT (country_code)
            DO UPDATE SET capacity_override_mw = EXCLUDED.capacity_override_mw
            RETURNING country_code, capacity_override_mw;
            `, // return the updated row
            [code.toUpperCase(), capacity]
        );

        return res.json(result.rows[0]);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error editing generation capacity for country ${code}` });
    }
})

// Update feature: edit county's generation_gwh_{year}
router.put('/:code/generation-gwh/:year', async (req, res) => {
    const { code, year } = req.params;
    const { generationData } = req.body;
    // Input validation
    if (generationData !== null && (generationData === undefined || typeof generationData !== 'number' || generationData < 0)) {
        return res.status(400).json({ error: "Generation (gwh) value must be a non-negative number or null" });
    }
    const yearInt = parseInt(year, 10);
    if (Number.isNaN(yearInt)) {
        return res.status(400).json({ error: "Year must be a valid integer" });
    }

    try {
        // If client sends null, remove the override
        //todo check
        if (generationData === null) {
            const deleted = await db.query(
                `DELETE FROM country_generation_overrides
                 WHERE country_code = $1 AND year = $2
                 RETURNING country_code, year;`,
                [code.toUpperCase(), yearInt]
            );
            if (deleted.rows.length === 0) {
                return res.status(404).json({ error: `No generation override found for ${code.toUpperCase()} year ${yearInt}` });
            }
            return res.json({ message: `Generation override removed for ${code.toUpperCase()} year ${yearInt}` });
        }
        
        // Upsert overrid
        const result = await db.query(
            `INSERT INTO country_generation_overrides (country_code, year, generation_override_gwh)
            VALUES ($1, $2, $3)
            ON CONFLICT (country_code, year)
            DO UPDATE SET generation_override_gwh = EXCLUDED.generation_override_gwh, updated_at = now()
            RETURNING country_code, year, generation_override_gwh;
            `,
            [code.toUpperCase(), yearInt, generationData]
        );

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error editing generation data for country ${code}, year ${year}` });
    }
})


export default router;


/**
Notes:

 * result of db.query() is an object with properties like:
    {
    command: 'UPDATE',
    rowCount: 1, // Number of rows affected by the query
    oid: null,
    rows: [], // the rows returned by the query. if "RETURNING *"" or specific columns, will have the updated rows.
    fields: [...],
    }
 */