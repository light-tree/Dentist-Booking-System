package com.rade.dentistbookingsystem.utils.image;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    String validateAndDownload(MultipartFile url) throws Exception;

    void removeImg(String id) throws Exception;
}
