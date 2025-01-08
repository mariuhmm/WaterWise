package com.cis3760.eauchart.waterwise;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.cis3760.eauchart.waterwise.models.IndustrialWastewaterChemicalsRequest;

public class IndustrialWastewaterChemicalsRequestTests {
    private IndustrialWastewaterChemicalsRequest request;

    @BeforeEach
    void setUp() {
        request = new IndustrialWastewaterChemicalsRequest();
    }

    @Test
    void testConstructorAndGetters() {
        request = new IndustrialWastewaterChemicalsRequest();
        request.setChemicalName("Test");
        assertEquals("Test", request.getChemicalName());
    }
}
