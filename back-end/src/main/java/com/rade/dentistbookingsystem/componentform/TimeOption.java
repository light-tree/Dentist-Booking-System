package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.SimpleDateFormat;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TimeOption implements Comparable<TimeOption> {
    String option;

    @Override
    public int compareTo(TimeOption o) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
            Date thisDate = sdf.parse(getOption().split("-")[0]);
            Date otherDate = sdf.parse(o.getOption().split("-")[0]);
            return thisDate.compareTo(otherDate);
        } catch (Exception e) {
            return 0;
        }
    }
}
