package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PageForFeedback {
    private String phone;
    private Integer status;
    private Integer serviceId;
    private String time;
    private Integer page;
}
