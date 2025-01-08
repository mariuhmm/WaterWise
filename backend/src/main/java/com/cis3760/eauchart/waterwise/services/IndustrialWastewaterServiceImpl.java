package com.cis3760.eauchart.waterwise.services;

import com.cis3760.eauchart.waterwise.mappers.StationMapper;
import com.cis3760.eauchart.waterwise.models.DTOs.StationInfoDTO;
import com.cis3760.eauchart.waterwise.mappers.ChemicalsMapper;
import com.cis3760.eauchart.waterwise.mappers.ReadingsMapper;
import com.cis3760.eauchart.waterwise.models.DTOs.ChemicalInfoDTO;
import com.cis3760.eauchart.waterwise.models.DTOs.ReadingInfoDTO;
import com.cis3760.eauchart.waterwise.repositories.WastewaterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IndustrialWastewaterServiceImpl implements IndustrialWastewaterService {

   private final WastewaterRepository wastewaterRepository;
   private final StationMapper stationMapper;
   private final ReadingsMapper readingsMapper;
   private final ChemicalsMapper chemicalsMapper;

   public IndustrialWastewaterServiceImpl(WastewaterRepository wastewaterRepository,
         StationMapper stationMapper,
         ReadingsMapper readingsMapper,
         ChemicalsMapper chemicalsMapper) {
      this.wastewaterRepository = wastewaterRepository;
      this.stationMapper = stationMapper;
      this.readingsMapper = readingsMapper;
      this.chemicalsMapper = chemicalsMapper;
   }

   @Override
   public List<StationInfoDTO> getStationInfo() {
      return stationMapper.wastewaterStationProjectionToStationInfoDTO(wastewaterRepository.getStations());
   }

   @Override
   public List<ReadingInfoDTO> getReadingInfo(String companyCode) {
      return readingsMapper.wastewaterReadingProjectionToReadingInfoDTO(wastewaterRepository.getReadings(companyCode));
   }

   @Override
   public List<ChemicalInfoDTO> getChemicalReadings(String companyCode, String chemicalName) {
      return chemicalsMapper.wastewaterReadingProjectionToChemicalInfoDTO(
            wastewaterRepository.getChemicalReadings(companyCode, chemicalName));
   }
}
