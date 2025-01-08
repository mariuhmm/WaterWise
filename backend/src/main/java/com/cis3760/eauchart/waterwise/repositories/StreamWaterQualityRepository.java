package com.cis3760.eauchart.waterwise.repositories;

import com.cis3760.eauchart.waterwise.models.StreamWaterQuality;
import com.cis3760.eauchart.waterwise.models.DTOs.StreamLeadInfoDTO;
import com.cis3760.eauchart.waterwise.repositories.projections.StreamWaterQualityReadingProjection;
import com.cis3760.eauchart.waterwise.repositories.projections.StreamWaterQualityStationProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StreamWaterQualityRepository extends JpaRepository<StreamWaterQuality, Long> {

    @Query(value =
            """
            SELECT sq.lastUpdated as lastUpdated,
                   sq.stationDetails as stationDetails,
                   m.stream_name as streamName
            FROM (
                SELECT MAX(last_updated) AS lastUpdated,
                       station AS stationDetails
                FROM stream_water_quality
                GROUP BY station
            ) sq
            JOIN stream_water_quality_monitoring m
            ON sq.stationDetails = m.station
            """,
            nativeQuery = true)
    List<StreamWaterQualityStationProjection> getStations();

    @Query(value =
            """
            SELECT DISTINCT
                last_updated as lastUpdated,
                parm_code as parameterCode,
                parm_description as parameterDescription,
                `year`,
                sample_date as date,
                sample_time as time,
                field_no as fieldNumber,
                remark_code as remarkCode,
                result,
                value_qualifier as valueQualifier,
                units,
                analysis_method as analysisMethod
            FROM stream_water_quality
            WHERE station = ?1
            """,
            nativeQuery = true)
    List<StreamWaterQualityReadingProjection> getReadings(String stationCode);

    // *** ONLY WHEN RUNNING WITH H2 ***
    //    Uncomment the query below and comment out the other when running the backend with H2.
    //    DATE_FORMAT() is compatible with MariaDB but not H2 - the H2 equivalent is FORMATDATETIME().
    //    YEAR() is compatible with MariaDB but not H2 - the H2 equivalent is EXTRACT(YEAR FROM ...).
    /*@Query(value = """
            SELECT
                station AS stationId,
                CAST(FORMATDATETIME(sample_date, 'yyyy-MM-01') AS DATE) AS date,
                parm_code AS parameterCode,
                AVG(result) AS result
            FROM
                stream_water_quality
            WHERE
                station = :station
                AND EXTRACT(YEAR FROM sample_date) = 2018
                AND parm_code IN ('PH', 'CLIDUR', 'PPUT')
            GROUP BY
                station, sample_date, parm_code
            ORDER BY
                station, date
            """, nativeQuery = true)*/
    @Query(value =
            """
            SELECT 
                station AS stationId,
                CAST(DATE_FORMAT(sample_date, '%Y-%m-01') AS DATE) AS date, 
                parm_code AS parameterCode, 
                AVG(result) AS result
            FROM 
                stream_water_quality
            WHERE 
                station = :station
                AND YEAR(sample_date) = 2018 
                AND parm_code IN ('PH', 'CLIDUR', 'PPUT')
            GROUP BY 
                station, DATE_FORMAT(sample_date, '%Y-%m-01'), parm_code
            ORDER BY 
                station, date
            """,
            nativeQuery = true)
    List<StreamWaterQualityReadingProjection> getMonthlyAverageForStation(String station);

    @Query(value = """
        SELECT 
            m.stream_name AS waterBodyName,
            'PBUT' AS parameterCode,
            AVG(sq.result) AS result
        FROM 
            stream_water_quality sq
        JOIN 
            stream_water_quality_monitoring m ON sq.station = m.station
        WHERE 
            sq.parm_code = 'PBUT'
        GROUP BY 
            m.stream_name
        ORDER BY 
            AVG(sq.result) DESC
        LIMIT 5
        """, nativeQuery = true)
    List<StreamWaterQualityReadingProjection> findTop5StreamsByAverageLeadContent();
}
