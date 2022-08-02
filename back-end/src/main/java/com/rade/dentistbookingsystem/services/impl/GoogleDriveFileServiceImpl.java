package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.utils.GoogleFileManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GoogleDriveFileServiceImpl implements com.rade.dentistbookingsystem.services.GoogleDriveFileService {

    @Autowired
    GoogleFileManager googleFileManager;

    @Override
    public void deleteFile(String id) throws Exception {
        googleFileManager.deleteFileOrFolder(id);
    }

    @Override
    public String uploadFile(MultipartFile file, String filePath, boolean isPublic) {
        String type = "";
        String role = "";
        if (isPublic) {
            // Public file of folder for everyone
            type = "anyone";
            role = "reader";
        } else {
            // Private
            type = "private";
            role = "private";
        }
        return googleFileManager.uploadFile(file, filePath, type, role);
    }
}
