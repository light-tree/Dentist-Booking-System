package com.rade.dentistbookingsystem.exceptions;

public class DuplicateRecordException extends RuntimeException {
    public DuplicateRecordException(String message) {
        super(message);
    }
}