package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.JsonPhone;
import com.rade.dentistbookingsystem.model.StoreOTPList;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Random;

@Component
@Service
public class SmsService {
    public String send(JsonPhone jsonPhone) throws ParseException {
        Twilio.init(Constant.ACCOUNT_SID, Constant.AUTH_TOKEN);
        String otp = "";
        otp = "";
        Random generator = new Random();
        for (int i = 0; i < Constant.OTP_LENGTH; i++) {
            int a = generator.nextInt() % 10;
            if (a < 0) {
                a = -a;
            }
            otp = otp.concat(Integer.toString(a));
        }
        String msg = "Mã OTP xác thực sđt cho tài khoản Nha Khoa RaDe của bạn là: " + otp + ". Mã có hiệu lực trong vòng " + Constant.VALID_TIME_FOR_VERIFICATION_AS_SECOND / 60 + " phút.";
        MessageCreator messageCreator = Message.creator(new PhoneNumber(jsonPhone.getPhone()), new PhoneNumber(Constant.FROM_NUMBER), msg);
        messageCreator.create();
        return otp;
    }
}

