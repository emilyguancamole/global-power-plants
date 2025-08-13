
--- Creates tables: countries, plants, and generation data.
--- Also includes some custom indexes for querying.

CREATE TABLE countries (
    country_code CHAR(3) PRIMARY KEY,
    country_name TEXT NOT NULL -- corresponds to "country"
);

CREATE TABLE power_plants (
    gppd_idnr TEXT PRIMARY KEY, -- 10 or 12 character identifier for the power plant
    name TEXT NOT NULL,
    country_code CHAR(3) REFERENCES countries(country_code) ON DELETE CASCADE, -- if country deleted, referential integrity
    capacity_mw NUMERIC, -- generating capacity megawatts
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    primary_fuel TEXT NOT NULL,
    other_fuel1 TEXT,
    other_fuel2 TEXT,
    other_fuel3 TEXT,
    commissioning_year INT,
    owner TEXT,
    source TEXT,  -- ? i guess references can be placed in another table. source also applies to generation data... so I think cur schema is in 2NF
    url TEXT,
    geolocation_source TEXT, -- ? depends on lat/long, which depend on gppd_idnr... sep geoloc table for 3NF?
    wepp_id TEXT, -- a reference to a unique plant identifier in the widely-used PLATTS-WEPP database
    year_of_capacity_data INT
);

CREATE TABLE generation_data (
    id SERIAL PRIMARY KEY, -- 
    gppd_idnr TEXT REFERENCES power_plants(gppd_idnr) ON DELETE CASCADE,
    year INT NOT NULL,
    generation_gwh NUMERIC,
    estimated_generation_gwh NUMERIC, 
    estimated_generation_note TEXT,
    generation_data_source TEXT,
    UNIQUE(gppd_idnr, year)  -- Ensure unique plant-year combinations
);

-- NOT YET BUT MAYBE LATER:
--CREATE TABLE fuel_types (
 --   id SERIAL PRIMARY KEY,
   -- fuel_type TEXT UNIQUE NOT NULL,
    --category TEXT NOT NULL,  -- 'renewable', 'fossil', 'nuclear', 'other'
    --is_renewable BOOLEAN DEFAULT FALSE,
--);

-- Helpful indexes
CREATE INDEX idx_power_plants_country_code ON power_plants(country_code);
CREATE INDEX idx_generation_year ON generation_data(year);
CREATE INDEX idx_gen_country_year ON generation_data(year, gppd_idnr);
