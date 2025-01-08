package com.cis3760.eauchart.waterwise.repositories;

import com.cis3760.eauchart.waterwise.models.LakeWaterQuality;
import com.cis3760.eauchart.waterwise.repositories.projections.LakeWaterQualityReadingProjection;
import com.cis3760.eauchart.waterwise.repositories.projections.LakeWaterQualityStationProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LakeWaterQualityRepository extends JpaRepository<LakeWaterQuality, Long> {

    @Query(value =
            """
            SELECT DISTINCT
                MAX(last_updated) as lastUpdated,
                lake_name as lakeName,
                station_code as stationCode,
                station_details as stationDetails
            FROM inland_lake_drinking_water_quality
            GROUP BY station_details
            """,
            nativeQuery = true)
    List<LakeWaterQualityStationProjection> getStations();

    @Query(value =
            """
            SELECT DISTINCT
                last_updated as lastUpdated,
                sample_date as sampleDate,
                gran_alkalinity as granAlkalinity,
                calcium,
                chloride, 
                specific_conductance as specificConductance, 
                dic, 
                doc, 
                iron, 
                potassium, 
                magnesium, 
                sodium, 
                ammonium_ammonia as ammoniumAmmonia, 
                nitrate_nitrite as nitrateNitrite, 
                tkn, 
                tn, 
                ph, 
                total_phosphorus as totalPhosphorus, 
                silicate, 
                sulfate 
            FROM inland_lake_drinking_water_quality
            WHERE station_details = ?1
            """,
            nativeQuery = true)
    List<LakeWaterQualityReadingProjection> getReadings(String stationCode);

    @Query(value =
            """
            SELECT sample_date AS sampleDate, lake_name AS lakeName, 
                ph, chloride, total_phosphorus AS totalPhosphorus, sulfate, 
                (COALESCE(CAST(ph AS DECIMAL(10, 2)), 0) + COALESCE(CAST(chloride AS DECIMAL(10, 2)), 0) + 
                COALESCE(CAST(total_phosphorus AS DECIMAL(10, 2)), 0) + COALESCE(CAST(sulfate AS DECIMAL(10, 2)), 0)) AS toxicityScore 
            FROM inland_lake_drinking_water_quality 
            WHERE lake_name = ?1 
            ORDER BY sample_date DESC 
            LIMIT 1
            """,
            nativeQuery = true)
    List<LakeWaterQualityReadingProjection> getWaterQualityByLake(String lakeName);

}
