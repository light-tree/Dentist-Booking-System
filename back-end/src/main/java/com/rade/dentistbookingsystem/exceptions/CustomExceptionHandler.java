package com.rade.dentistbookingsystem.exceptions;

import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ValidationException;
import java.net.UnknownHostException;
import java.util.concurrent.TimeoutException;

@CrossOrigin
@RestControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ChangeSetPersister.NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handlerNotFoundException(ChangeSetPersister.NotFoundException ex, WebRequest req) {
        ex.printStackTrace();

        return new ErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DuplicateRecordException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handlerDuplicateRecordException(DuplicateRecordException ex, WebRequest req) {
        ex.printStackTrace();
        return new ErrorResponse(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    public ErrorResponse handlerValidationException(Exception ex, WebRequest req) {
        ex.printStackTrace();
        return new ErrorResponse(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
    }

    @ExceptionHandler(UnknownHostException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ResponseEntity<?> handlerUnknownHostException(Exception ex, WebRequest req) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Some error has occurred, please check you internet again");
    }

    @ExceptionHandler(TimeoutException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ResponseEntity<?> handlerTimeOutException(Exception ex, WebRequest req) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Server timeout, please check you internet again");
    }

    // Xử lý tất cả các exception chưa được khai báo
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    public ErrorResponse handlerException(Exception ex, WebRequest req) {
        // Log err
        ex.printStackTrace();
        return new ErrorResponse(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
    }
}