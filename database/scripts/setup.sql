use template_db;

create table if not exists stream_water_quality (
    id int primary key,
    last_updated datetime,
    station varchar(100),
    parm_code varchar(50),
    parm_description varchar(255),
    year year,
    sample_date date,
    sample_time time,
    field_no varchar(50),
    remark_code varchar(25),
    result decimal(10, 3),
    value_qualifier varchar(50),
    units varchar(50),
    analysis_method varchar(100)
);

create table if not exists stream_water_quality_monitoring (
    id int primary key,
    last_updated datetime,
    station varchar(100),
    stream_name varchar(100)
);

create table if not exists industrial_wastewater_by_facility (
    id int primary key, 
    last_updated datetime,
    sector varchar(100),
    works_name varchar(100),
    company_code varchar(50),
    municipality varchar(100),
    sample_date varchar(20),
    control_point_name varchar(100),
    parameter_name varchar(100),
    frequency varchar(50),
    component_type varchar(50),
    measured_value decimal(10, 3),
    unit_of_measure varchar(50)
);


create table if not exists inland_lake_drinking_water_quality (
    id int primary key,
    last_updated datetime,
    lake_name varchar(100),
    station_code varchar(50),
    station_details varchar(255),
    sample_date varchar(20),
    gran_alkalinity decimal(10, 3),
    calcium decimal(10, 3),
    chloride decimal(10, 3),
    specific_conductance decimal(10, 3),
    dic decimal(10, 3),
    doc decimal(10, 3),
    iron decimal(10, 3),
    potassium decimal(10, 3),
    magnesium decimal(10, 3),
    sodium decimal(10, 3),
    ammonium_ammonia decimal(10, 3),
    nitrate_nitrite decimal(10, 3),
    tkn decimal(10, 3),
    tn decimal(10, 3),
    ph decimal(3, 2),
    total_phosphorus decimal(10, 3),
    silicate decimal(10, 3),
    sulfate decimal(10, 3)
);
