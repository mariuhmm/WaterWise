package com.cis3760.eauchart.waterwise.models.DTOs;

import java.math.BigDecimal;

public class StreamLeadInfoDTO {
    private String waterBodyName;
    private String parameterCode;
    private BigDecimal result;

    // Default constructor
    public StreamLeadInfoDTO() {}

    // Constructor with waterBodyName, parameterCode, and result
    public StreamLeadInfoDTO(String waterBodyName, String parameterCode, BigDecimal result) {
        this.waterBodyName = waterBodyName;
        this.parameterCode = parameterCode;
        this.result = result;
    }

    // Constructor with parameterCode and result (if needed elsewhere)
    public StreamLeadInfoDTO(String parameterCode, BigDecimal result) {
        this.parameterCode = parameterCode;
        this.result = result;
    }

    // Getters and Setters
    public String getWaterBodyName() {
        return waterBodyName;
    }

    public void setWaterBodyName(String waterBodyName) {
        this.waterBodyName = waterBodyName;
    }

    public String getParameterCode() {
        return parameterCode;
    }

    public void setParameterCode(String parameterCode) {
        this.parameterCode = parameterCode;
    }

    public BigDecimal getResult() {
        return result;
    }

    public void setResult(BigDecimal result) {
        this.result = result;
    }
}
