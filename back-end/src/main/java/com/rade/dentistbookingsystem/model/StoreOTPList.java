package com.rade.dentistbookingsystem.model;

import com.rade.dentistbookingsystem.Constant;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Data
public class StoreOTPList {
    private static ArrayList<StoreOTP> storeOTPList = new ArrayList<>();

    public static StoreOTP getStoredOTP(String phone) {
        for (StoreOTP tmp : storeOTPList) {
            if (tmp.getPhone().equals(phone)) {
                return tmp;
            }
        }
        return null;
    }

    public static boolean verifyOTP(StoreOTP storeOTP, StoreOTP receivedOTP) {
        return
                storeOTP.getOtp().equals(receivedOTP.getOtp()) &&
                        TimeUnit.MILLISECONDS.toSeconds(
                                (new Date()).getTime() - storeOTP.getGeneratedDate().getTime()
                        ) <= Constant.VALID_TIME_FOR_VERIFICATION_AS_SECOND;
    }

    public static void storeOTP(StoreOTP storeOTP) {
        boolean exist = false;
        for (StoreOTP tmp : storeOTPList) {
            if (tmp.getPhone().equals(storeOTP.getPhone())) {
                tmp.setOtp(storeOTP.getOtp());
                tmp.setGeneratedDate(storeOTP.getGeneratedDate());
                exist = true;
                break;
            }
        }
        if (!exist) {
            storeOTPList.add(storeOTP);
        }
    }
}
