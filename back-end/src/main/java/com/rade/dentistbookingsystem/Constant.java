package com.rade.dentistbookingsystem;

public class Constant {
    //ACCOUNT
    public static final int ACCOUNT_ROLE_ADMIN = 1;
    public static final int ACCOUNT_ROLE_USER = 2;
    public static final int ACCOUNT_ROLE_STAFF = 3;
    public static final int ACCOUNT_STATUS_ACTIVE = 1;
    public static final int ACCOUNT_STATUS_INACTIVE = 2;


    //DOCTOR
    public static final int DOCTOR_STATUS_ACTIVE = 1;
    public static final int DOCTOR_STATUS_INACTIVE = 2;


    //BRANCH
    public static final int BRANCH_STATUS_ACTIVE = 1;
    public static final int BRANCH_STATUS_INACTIVE = 2;


    //DISCOUNT
    public static final int DISCOUNT_STATUS_ACTIVE = 1;
    public static final int DISCOUNT_STATUS_INACTIVE = 2;


    //FEEDBACK
    public static final int FEEDBACK_STATUS_WAITING = 0;
    public static final int FEEDBACK_STATUS_APPROVE = 1;
    public static final int FEEDBACK_STATUS_DISAPPROVE = 2;


    //SERVICE
    public static final int SERVICE_STATUS_ACTIVE = 1;
    public static final int SERVICE_STATUS_INACTIVE = 2;


    //APPOINTMENT
    public static final int APPOINTMENT_STATUS_WAITING = 0;
    public static final int APPOINTMENT_STATUS_DONE = 1;
    public static final int APPOINTMENT_STATUS_ABSENT = 2;
    public static final int APPOINTMENT_STATUS_CANCEL = 3;
    public static final int APPOINTMENT_STATUS_GAVE_FEEDBACK = 5;
    public static final int APPOINTMENT_STATUS_CANCEL_BY_ADMIN = 6;
    public static final int SIZE_OF_PAGE_FOR_HISTORY_OF_PATIENT_VIEW = 5;


    //BUSINESS RULE
    public static final int INTERVAL_TIME_FOR_EACH_WORKING_SLOT_AS_MINUTE = 30;
    public static final int MAX_LATE_TIME_TO_MARK_ABSENT_AS_MINUTE = 15;
    public static final int ABSENT_TIME_IN_A_ROW_TO_BAN = 3;
    public static final int VIOLATED_FEEDBACK_TIME_TO_BAN = 3;
    public static final int CANCEL_TIMES_LIMIT_FOR_INTERVAL_FOR_CANCEL_APPOINTMENT  = 3;
    public static final int INTERVAL_FOR_CANCEL_APPOINTMENT_AS_DAY = 30;
    public static final int TIME_BEFORE_ALLOW_TO_CANCEL_OR_UPDATE_AS_DAY = 1;
    public static final int TIME_BEFORE_TO_REMIND_APPOINTMENT_AS_DAY = 2;
    public static final int TIME_FOR_MARK_ABSENT_AS_MINUTE = 15;
    public static final int VALID_TIME_FOR_VERIFICATION_AS_SECOND = 120;


    //TWILIO
    public static final String ACCOUNT_SID = "AC0dcea50829a1f572a348d76ece647dff";
    public static final String AUTH_TOKEN = "32fe871fc7998c773cdb834b760f6ed7";
    public static final String FROM_NUMBER = "+14323005761";
    public static final int OTP_LENGTH = 6;

    //JWT
    public static final String SECRET_KEY = "7DE2F49FA1691939F7A8A9951E2EB7DE2F49FA1691939F7A8A9951E2EB7DE2F49FA1691939F7A8A9951E2EB7DE2F49FA1691939F7A8A9951E2EB";

}
