package com.cis3760.eauchart.waterwise.services;

import com.cis3760.eauchart.waterwise.mappers.ReadingsMapper;
import com.cis3760.eauchart.waterwise.mappers.StationMapper;
import com.cis3760.eauchart.waterwise.models.DTOs.ReadingInfoDTO;
import com.cis3760.eauchart.waterwise.models.DTOs.StationInfoDTO;
import com.cis3760.eauchart.waterwise.models.DTOs.WaterQualityDTO;
import com.cis3760.eauchart.waterwise.repositories.LakeWaterQualityRepository;
import org.springframework.stereotype.Service;
import com.cis3760.eauchart.waterwise.repositories.projections.LakeWaterQualityReadingProjection;
import java.util.stream.Collectors;

import java.util.List;

@Service
public class InlandLakeServiceImpl implements InlandLakeService {

   private final LakeWaterQualityRepository lakeWaterQualityRepository;
   private final StationMapper stationMapper;
   private final ReadingsMapper readingsMapper;

   public InlandLakeServiceImpl(LakeWaterQualityRepository lakeWaterQualityRepository,
         StationMapper stationMapper,
         ReadingsMapper readingsMapper) {
      this.lakeWaterQualityRepository = lakeWaterQualityRepository;
      this.stationMapper = stationMapper;
      this.readingsMapper = readingsMapper;
   }

   @Override
   public List<StationInfoDTO> getStationInfo() {
      return stationMapper.lakeWaterQualityStationProjectionToStationInfoDTO(lakeWaterQualityRepository.getStations());
   }

   @Override
   public List<ReadingInfoDTO> getReadingInfo(String stationCode) {
      return readingsMapper
            .lakeWaterQualityReadingProjectionToReadingInfoDTO(lakeWaterQualityRepository.getReadings(stationCode));
   }

   @Override
   public List<WaterQualityDTO> fetchWaterQualityByLake(String lakeName) {
      List<LakeWaterQualityReadingProjection> projections = lakeWaterQualityRepository.getWaterQualityByLake(lakeName);
      return readingsMapper.lakeWaterQualityReadingProjectionToWaterQualityDTO(projections)
            .stream().distinct().collect(Collectors.toList());
   }

}
