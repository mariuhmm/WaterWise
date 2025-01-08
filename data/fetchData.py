import requests
import mysql.connector
from mysql.connector import connect, Error
import time
import datetime


API_KEY = "SE90DFK0Wh-a3EO0ipLMIUDRcdMFtr0oMDNQArENpHwAbwNaUKaenQ"
 
def fetch_data(retries = 5, delay = 5):
   num_of_attempts = 0
   
   datasets = [
      "Industrial_Wastewater_By_Facility",
      "Inland_Lake_Drinking_Water_Quality",
      "Stream_Water_Quality",
      "Stream_Water_Quality_Monitoring"
   ]
   
   all_data={}
   
   for dataset in datasets:
      try:
         url = f"https://cis-data-service.socs.uoguelph.ca/data/{dataset}"
         response = requests.get(url, headers={"Apikey": API_KEY})
         response.raise_for_status()
         
         raw_data = response.json()
         all_data[dataset] = raw_data
         
         print(f"Fetched data from {dataset}")
      
      except requests.exceptions.RequestException as e:
         print(f"Error: {e} for dataset: {dataset} on attempt {num_of_attempts+1}/{retries}")
         num_of_attempts += 1
         
         if num_of_attempts < retries:
               # Waits between each retry
            time.sleep(delay * num_of_attempts)
         else:
            print("Maxiumum number of retrys has been reached. Could not connect to database.")
               
   return all_data
         
def update_database():
  print(f"Updating database at: {datetime.datetime.now()}")
  
  cleaned_data = fetch_data()
    
  try:
      db_conn = mysql.connector.connect(
          user="root",
          password="pwd",
          host="database",
          database="template_db",
          collation="utf8mb4_unicode_ci",
          charset="utf8mb4",
      )
      
  except Error as e:
      print(f"Error connecting to database: {e}")
      return {
          "status": 500,
          "response": f"Database connection error: {e}"
      }

  db_cursor = db_conn.cursor()
   
   # Disabling strict mode to eliminate empty string data value errors
  db_cursor.execute("SET SESSION sql_mode = ''")
  
  industrial_wastewater_fields = cleaned_data['Industrial_Wastewater_By_Facility']
  filtered_industrial_wastewater_fields = []
  
  # Specific names of highly polluting chemicals we want to analyze
  polluting_chemicals = ["PHOSPHORUS,UNFILTERED TOTAL", "LEAD,     UNFILTERED TOTAL", "MERCURY,  UNFILTERED TOTAL", "NITRATES TOTAL,   FILTER.REAC"]
  
  for row in industrial_wastewater_fields:
    if row["Component Type"] == "AVERAGE" and row["Parameter Name"] in polluting_chemicals:
        filtered_industrial_wastewater_fields.append(row)
  
  for item in filtered_industrial_wastewater_fields:
    try:
        db_cursor.execute(
        """INSERT INTO industrial_wastewater_by_facility (
            id, last_updated, sector, works_name, company_code, municipality, 
            sample_date, control_point_name, parameter_name, frequency, 
            component_type, measured_value, unit_of_measure
            ) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
            last_updated = VALUES(last_updated), 
            sector = VALUES(sector), 
            works_name = VALUES(works_name),
            company_code = VALUES(company_code),
            municipality = VALUES(municipality),
            sample_date = VALUES(sample_date),
            control_point_name = VALUES(control_point_name),
            parameter_name = VALUES(parameter_name),
            frequency = VALUES(frequency),
            component_type = VALUES(component_type),
            measured_value = VALUES(measured_value),
            unit_of_measure = VALUES(unit_of_measure)
            """,
            (
                item.get("id"),
                item.get("last_updated"),        
                item.get("\ufeffSECTOR"),              
                item.get("Works Name"),
                item.get("Company Code"),
                item.get("Municipality"),
                item.get("SAMPLEDATE"),
                item.get("Control Point Name"),
                item.get("Parameter Name"),
                item.get("Frequency"),
                item.get("Component Type"),
                item.get("Value"),
                item.get("Unit of Measure")
            )
        )
        
        db_conn.commit()
    except Error as e:
        print(f"Error inserting/updating data: {e}")
        return {
            "status": 500,
            "response": f"Error adding to database: {e}"
        }
      
  print("'industrial_wastewater_by_facility' table has been updated.")

    
    
  for item in cleaned_data['Stream_Water_Quality']:
    try:
      # Handle empty or None result
      result_value = item.get("RESULT")
      if not result_value:  # This will check for empty strings or None
          result_value = None
          
      db_cursor.execute(
          """INSERT INTO stream_water_quality (
              id, last_updated, station, parm_code, parm_description, year, 
              sample_date, sample_time, field_no, remark_code, result, 
              value_qualifier, units, analysis_method
              ) 
              VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
              ON DUPLICATE KEY UPDATE 
              station = VALUES(station), 
              parm_code = VALUES(parm_code),
              parm_description = VALUES(parm_description),
              year = VALUES(year),
              sample_date = VALUES(sample_date),
              sample_time = VALUES(sample_time),
              field_no = VALUES(field_no),
              remark_code = VALUES(remark_code),
              result = VALUES(result),
              value_qualifier = VALUES(value_qualifier),
              units = VALUES(units),
              analysis_method = VALUES(analysis_method)
          """,
          (
              item.get("id"),
              item.get("last_updated"),
              item.get("\ufeffSTATION").zfill(11),  # Ensure station code is 11 digits, add leading 0s if not
              item.get("PARM"),
              item.get("PARM_DESCRIPTION"),
              item.get("YEAR"),
              item.get("DATE_YYYYMMDD"),
              item.get("TIME_HH:MM"),
              item.get("FIELD_NO"),
              item.get("REMARK_CODE"),
              result_value,
              item.get("VALUQUALIFI"),
              item.get("UNITS"),
              item.get("ANALMETHOD")
          )
      )
      db_conn.commit()
    except Error as e:
      print(f"Error inserting/updating data: {e}")
      return {
          "status": 500,
          "response": f"Error adding to database: {e}"
      }

  print("'stream_water_quality' table has been updated.")

  for item in cleaned_data['Stream_Water_Quality_Monitoring']:
    try:
      # Handle empty or None result
      result_value = item.get("RESULT")
      if not result_value:  # This will check for empty strings or None
          result_value = None
          
      db_cursor.execute(
          """INSERT INTO stream_water_quality_monitoring (
              id, last_updated, station, stream_name
              ) 
              VALUES (%s, %s, %s, %s)
              ON DUPLICATE KEY UPDATE
              station = VALUES(station),
              stream_name = VALUES(stream_name)
          """,
          (
              item.get("id"),
              item.get("last_updated"),
              item.get("STATION"),
              item.get("NAME")
          )
      )
      db_conn.commit()
    except Error as e:
      print(f"Error inserting/updating data: {e}")
      return {
          "status": 500,
          "response": f"Error adding to database: {e}"
      }
        
  print("'stream_water_quality_monitoring' table has been updated.")
        
  for item in cleaned_data['Inland_Lake_Drinking_Water_Quality']:
    try:
      db_cursor.execute(
          """INSERT INTO inland_lake_drinking_water_quality (
              id, last_updated, lake_name, station_code, station_details, 
              sample_date, gran_alkalinity, calcium, chloride, 
              specific_conductance, dic, doc, iron, 
              potassium, magnesium, sodium, ammonium_ammonia, 
              nitrate_nitrite, tkn, tn, ph, 
              total_phosphorus, silicate, sulfate
              ) 
              VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
              ON DUPLICATE KEY UPDATE 
              lake_name = VALUES(lake_name), 
              station_code = VALUES(station_code),
              station_details = VALUES(station_details),
              sample_date = VALUES(sample_date),
              gran_alkalinity = VALUES(gran_alkalinity),
              calcium = VALUES(calcium),
              chloride = VALUES(chloride),
              specific_conductance = VALUES(specific_conductance),
              dic = VALUES(dic),
              doc = VALUES(doc),
              iron = VALUES(iron),
              potassium = VALUES(potassium),
              magnesium = VALUES(magnesium),
              sodium = VALUES(sodium),
              ammonium_ammonia = VALUES(ammonium_ammonia),
              nitrate_nitrite = VALUES(nitrate_nitrite),
              tkn = VALUES(tkn),
              tn = VALUES(tn),
              ph = VALUES(ph),
              total_phosphorus = VALUES(total_phosphorus),
              silicate = VALUES(silicate),
              sulfate = VALUES(sulfate)
          """,
          (
              item.get("id"),
              item.get("last_updated"),
              item.get("LAKE"),
              item.get("STN"),
              item.get("STATION"),
              item.get("SDATE"),
              item.get("Gran Alkalinity (mg/L)"),
              item.get("Ca (mg/L)"),
              item.get("Cl (mg/L)"),
              item.get("Specific conductance (mcS/cm at 25C)"),
              item.get("DIC (mg/L)"),
              item.get("DOC (mg/L)"),
              item.get("Fe (mcg/L)"),
              item.get("K (mg/L)"),
              item.get("Mg (mg/L)"),
              item.get("Na (mg/L)"),
              item.get("NH4/NH3 (mcg/L)"),
              item.get("NO3/NO2 (mcg/L)"),
              item.get("TKN (mcg/L)"),
              item.get("TN (mcg/L)"),
              item.get("pH"),
              item.get("TP (mcg/L)"),
              item.get("SiO3 (mg/L)"),
              item.get("SO4 (mg/L)")
          )
      )
      db_conn.commit()
      
    except Error as e:
      print(f"Error inserting/updating data: {e}")
      return {
          "status": 500,
          "response": f"Error adding to database: {e}"
      }

  print("'inland_lake_drinking_water_quality' table has been updated.")
    

  db_cursor.close()
  db_conn.close()
    

  return {
      "status": 200,
      "response": "Database update successful"
  }
   
    
if __name__ == "__main__":
    update_database()