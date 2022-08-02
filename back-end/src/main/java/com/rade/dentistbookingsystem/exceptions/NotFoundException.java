package com.rade.dentistbookingsystem.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}