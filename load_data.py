import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv

load_dotenv() # api/.env
DB_NAME = "global_power_plants"
DB_USER = "postgres"
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST") # "localhost" for local machine; "db" for potgres in docker
DB_PORT = os.getenv("DB_PORT") #should be "5433"; this is the port on the HOST machine on which the db runs
CSV_FILE = "./globalpowerplantdatabase/global_power_plant_database.csv"

'''
Script for data loading from CSV to Postgres, using Python via psycopg2. Assumes database and tables already created.
Inserts data in the order (countries → plants → generation).
Uses .env from root folder, where DB_HOST is localhost
'''


# NaNs in csv need to be handled before insertion to avoid errors
def safe_int(val):
    if pd.isna(val):
        return None
    try:
        return int(val)
    except:
        return None

def safe_float(val):
    if pd.isna(val):
        return None
    try:
        return float(val)
    except:
        return None

print("Loading data from CSV file and inserting to database")
df = pd.read_csv(CSV_FILE)
df = df.where(pd.notnull(df), None) # replace NaNs with None


conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cursor = conn.cursor()

# Clear existing data
cursor.execute("TRUNCATE TABLE generation_data CASCADE;")
cursor.execute("TRUNCATE TABLE power_plants CASCADE;") 
cursor.execute("TRUNCATE TABLE countries CASCADE;")
conn.commit()


# Countries table
countries_df = df[['country', 'country_long']].drop_duplicates()
for _, row in countries_df.iterrows():
    cursor.execute("""
        INSERT INTO countries (country_code, country_name)
        VALUES (%s, %s)
        ON CONFLICT (country_code) DO NOTHING;
    """, (row['country'], row['country_long']))

# Plant table
plant_cols = [
    'gppd_idnr', 'name', 'country', 'capacity_mw', 'latitude', 'longitude', 'primary_fuel', 'other_fuel1', 'other_fuel2', 'other_fuel3', 'commissioning_year', 'owner', 'source', 'url', 'geolocation_source', 'wepp_id', 'year_of_capacity_data'
]

for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO power_plants (
            gppd_idnr, name, country_code, capacity_mw, latitude, longitude, primary_fuel, other_fuel1, other_fuel2, other_fuel3, commissioning_year, owner, source, url, geolocation_source, wepp_id, year_of_capacity_data
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        row['gppd_idnr'],
        row['name'],
        row['country'],
        safe_float(row['capacity_mw']),
        safe_float(row['latitude']),
        safe_float(row['longitude']),
        row['primary_fuel'],
        row['other_fuel1'],
        row['other_fuel2'],
        row['other_fuel3'],
        safe_int(row['commissioning_year']),
        row['owner'],
        row['source'],
        row['url'],
        row['geolocation_source'],
        row['wepp_id'],
        safe_int(row['year_of_capacity_data'])
    ))


## generation_data table -- cast to normal Python types

# find all years in the dataset
years = [col.split('_')[-1] for col in df.columns if col.startswith('generation_gwh_')]
years = list(map(int, years))
print(years)

for _, row in df.iterrows():
    for year in years:
        cursor.execute("""
        INSERT INTO generation_data (
            gppd_idnr, year, generation_gwh, estimated_generation_gwh, estimated_generation_note, generation_data_source
        ) VALUES (%s, %s, %s, %s, %s, %s)
        """, (  
            str(row['gppd_idnr']),
            int(year),
            safe_int(row.get(f'generation_gwh_{year}')),
            safe_int(row.get(f'estimated_generation_gwh_{year}')),
            row.get(f'estimated_generation_note_{year}'),
            row.get('generation_data_source')
        ))


conn.commit() # commit changes to db
cursor.close()
conn.close()
print("Done loading data!!")