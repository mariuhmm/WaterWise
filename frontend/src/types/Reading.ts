export interface Reading {
    // Industrial Wastewater By Facility
    lastUpdated?: string | null; // Datetime of when the row was uploaded to the CIS Data Service
    sampleDate?: string | null; // Date when the sample was taken
    controlPointName?: string | null; // Name of the sampling location within the facility
    controlPointId?: string | null; // Unique ID for the control point
    parameterName?: string | null; // Pollutant or substance being measured
    parameterReportedAs?: string | null; // How the parameter is expressed
    frequency?: string | null; // Frequency of sample collection
    resultStructure?: string | null; // Structure or format of the result
    componentType?: string | null; // Type of measure e.g. Max/Min/Average
    measuredValue?: string | null; // Measured value of the parameter
    unitOfMeasure?: string | null; // Unit of measurement for the value
    regulation?: string | null; // Applicable regulatory standard or limit
  
    // Inland Lake Drinking Water Quality
    toxicityScore: number; // Calculated toxicity score
    granAlkalinity?: string | null; // Alkalinity level in mg/L
    calcium?: string | null; // Calcium concentration in mg/L
    chloride?: string | null; // Chloride concentration in mg/L
    specificConductance?: string | null; // Conductance in mcS/cm at 25C
    dic?: string | null; // Dissolved Inorganic Carbon in mg/L
    doc?: string | null; // Dissolved Organic Carbon in mg/L
    iron?: string | null; // Iron concentration in mcg/L
    potassium?: string | null; // Potassium concentration in mg/L
    magnesium?: string | null; // Magnesium concentration in mg/L
    sodium?: string | null; // Sodium concentration in mg/L
    ammoniumAmmonia?: string | null; // Ammonium and ammonia concentration in mcg/L
    nitrateNitrite?: string | null; // Nitrate and nitrite concentration in mcg/L
    tkn?: string | null; // Total Kjeldahl Nitrogen in mcg/L
    tn?: string | null; // Total Nitrogen in mcg/L
    ph?: string | null; // Acidity or basicity of the water
    totalPhosphorus?: string | null; // Total Phosphorus concentration in mcg/L
    silicate?: string | null; // Silicate concentration in mg/L
    sulfate?: string | null; // Sulfate concentration in mg/L
  
    // Stream Water Quality
    parameterCode?: string | null; // Code for the parameter being measured
    parameterDescription?: string | null; // Detailed description of the parameter
    year?: string | null; // Year of sample collection
    date?: string | null; // Date of sample collection
    time?: string | null; // Time of sample collection in HH:MM format
    fieldNumber?: string | null; // Unique field number for the sampling event
    remarkCode?: string | null; // Code indicating specific conditions or remarks
    result?: string | null; // The measured result of the parameter
    valueQualifier?: string | null; // Qualifier for the result
    units?: string | null; // Unit of measurement for the result
    analysisMethod?: string | null; // Analytical method used to measure the parameter
  }
  