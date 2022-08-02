package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.model.FeedbackDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FeedbackAndPhone {
    private FeedbackDTO feedbackDTO;
    private String phone;
}
