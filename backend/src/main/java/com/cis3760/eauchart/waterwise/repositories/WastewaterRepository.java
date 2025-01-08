package com.cis3760.eauchart.waterwise.repositories;

import com.cis3760.eauchart.waterwise.models.Wastewater;
import com.cis3760.eauchart.waterwise.repositories.projections.WastewaterStationProjection;
import com.cis3760.eauchart.waterwise.repositories.projections.WastewaterReadingProjection;
import com.cis3760.eauchart.waterwise.repositories.projections.WastewaterChemicalProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WastewaterRepository extends JpaRepository<Wastewater, Long> {

    @Query(value =
            """
            SELECT DISTINCT
                MAX(last_updated) as lastUpdated,
                sector,
                works_name as worksName,
                company_code as companyCode,
                municipality
            FROM industrial_wastewater_by_facility
            GROUP BY company_code
            """,
            nativeQuery = true)
    List<WastewaterStationProjection> getStations();

    @Query(value =
            """
            SELECT DISTINCT 
                last_updated as lastUpdated, 
                sample_date as sampleDate, 
                control_point_name as controlPointName, 
                parameter_name as parameterName,
                frequency,
                component_type as componentType,
                measured_value as measuredValue,
                unit_of_measure as unitOfMeasure
            FROM industrial_wastewater_by_facility
            WHERE company_code = ?1
            """,
            nativeQuery = true)
    List<WastewaterReadingProjection> getReadings(String companyCode);

    @Query(value =
                "SELECT DISTINCT \n" +
                "  last_updated as lastUpdated, \n" +
                "  sample_date as sampleDate, \n" +
                "  measured_value as measuredValue,\n" +
                "  unit_of_measure as unitOfMeasure\n" +
                "FROM industrial_wastewater_by_facility\n" +
                "WHERE company_code = ?1 AND parameter_name = ?2",
            nativeQuery = true)
    List<WastewaterChemicalProjection> getChemicalReadings(String stationCode, String chemicalName);
}
