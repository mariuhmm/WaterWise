package com.cis3760.eauchart.waterwise.services;

import com.cis3760.eauchart.waterwise.mappers.ReadingsMapper;
import com.cis3760.eauchart.waterwise.mappers.StationMapper;
import com.cis3760.eauchart.waterwise.models.DTOs.ReadingInfoDTO;
import com.cis3760.eauchart.waterwise.models.DTOs.StationInfoDTO;
import com.cis3760.eauchart.waterwise.models.DTOs.StreamWaterQualityDTO;
import com.cis3760.eauchart.waterwise.models.DTOs.StreamLeadInfoDTO;
import com.cis3760.eauchart.waterwise.repositories.StreamWaterQualityRepository;
import com.cis3760.eauchart.waterwise.repositories.projections.StreamWaterQualityReadingProjection;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class StreamServiceImpl implements StreamService {

   private final StreamWaterQualityRepository streamWaterQualityRepository;
   private final StationMapper stationMapper;
   private final ReadingsMapper readingsMapper;

   public StreamServiceImpl(StreamWaterQualityRepository streamWaterQualityRepository,
         StationMapper stationMapper,
         ReadingsMapper readingsMapper) {
      this.streamWaterQualityRepository = streamWaterQualityRepository;
      this.stationMapper = stationMapper;
      this.readingsMapper = readingsMapper;
   }

   @Override
   public List<StationInfoDTO> getStationInfo() {
      return stationMapper
            .streamWaterQualityStationProjectionToStationInfoDTO(streamWaterQualityRepository.getStations());
   }

   @Override
   public List<ReadingInfoDTO> getReadingInfo(String stationCode) {
      return readingsMapper
            .streamWaterQualityReadingProjectionToReadingInfoDTO(streamWaterQualityRepository.getReadings(stationCode));
   }

   @Override
   public List<Map<String, Object>> getMonthlyAveragesForStation(String stationCode) {
      // Retrieve data from the repository
      List<StreamWaterQualityReadingProjection> projections = streamWaterQualityRepository
            .getMonthlyAverageForStation(stationCode);

      // Transform and group the data
      return projections.stream().collect(Collectors.groupingBy(
            StreamWaterQualityReadingProjection::getParameterCode, // Group by parameter code
            Collectors.mapping(projection -> {
               Map<String, Object> dataPoint = new HashMap<>();
               dataPoint.put("date", projection.getDate());
               dataPoint.put("result", projection.getResult());
               return dataPoint;
            }, Collectors.toList()) // Collect each grouped parameter's data as a list
        )).entrySet().stream().map(entry -> {
            Map<String, Object> parameterData = new HashMap<>();
            parameterData.put("parameterCode", entry.getKey());
            parameterData.put("data", entry.getValue());
            return parameterData;
        }).collect(Collectors.toList());
    }

    @Override
    public List<StreamLeadInfoDTO> getTop5StreamsByLeadContent() {
        return streamWaterQualityRepository.findTop5StreamsByAverageLeadContent()
            .stream()
            .map(proj -> new StreamLeadInfoDTO(proj.getWaterBodyName(), proj.getParameterCode(), proj.getResult()))
            .collect(Collectors.toList());
    }
}
