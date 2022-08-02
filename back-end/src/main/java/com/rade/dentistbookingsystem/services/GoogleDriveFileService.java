package com.rade.dentistbookingsystem.services;

import org.springframework.web.multipart.MultipartFile;

public interface GoogleDriveFileService {
    void deleteFile(String id) throws Exception;

    String uploadFile(MultipartFile file, String filePath, boolean isPublic);
}
