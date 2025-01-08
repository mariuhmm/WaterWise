package com.cis3760.eauchart.waterwise;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.cis3760.eauchart.waterwise.models.DTOs.StreamLeadInfoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

public class StreamLeadInfoDTOTests {

    private StreamLeadInfoDTO streamLeadInfoDTO;

    @BeforeEach
    public void setUp() {
        streamLeadInfoDTO = new StreamLeadInfoDTO();
    }

    @Test
    public void testEmptyConstructor() {
        assertNull(streamLeadInfoDTO.getWaterBodyName());
        assertNull(streamLeadInfoDTO.getParameterCode());
        assertNull(streamLeadInfoDTO.getResult());
    }

    @Test
    public void testConstructor() {
        StreamLeadInfoDTO dto = new StreamLeadInfoDTO("Rideau River", "PBUT", new BigDecimal("0.9033333"));

        assertEquals("Rideau River", dto.getWaterBodyName());
        assertEquals("PBUT", dto.getParameterCode());
        assertEquals(new BigDecimal("0.9033333"), dto.getResult());
    }

    @Test
    public void testSettersAndGetters() {
        streamLeadInfoDTO.setWaterBodyName("Ekwan River");
        streamLeadInfoDTO.setParameterCode("PBUT");
        streamLeadInfoDTO.setResult(new BigDecimal("0.1250000"));

        assertEquals("Ekwan River", streamLeadInfoDTO.getWaterBodyName());
        assertEquals("PBUT", streamLeadInfoDTO.getParameterCode());
        assertEquals(new BigDecimal("0.1250000"), streamLeadInfoDTO.getResult());
    }
}
