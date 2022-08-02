package com.rade.dentistbookingsystem.utils.image;


import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.services.GoogleDriveFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageServiceImpl implements ImageService {
    private static String[] imgType = {".png", ".jpg", ".jpeg", ".jfif"};
    @Autowired
    GoogleDriveFileService googleDriveFileService;

    @Override
    public String validateAndDownload(MultipartFile url) throws Exception {
        if (url.isEmpty()) throw new NotFoundException("File not found");
        String imgSrcType = url.getOriginalFilename();
        boolean check = false;
        for (int i = 0; i < imgType.length; i++) {
            if (imgSrcType.endsWith(imgType[i])) {
                check = true;
                break;
            }
        }

        if (check) {

            return googleDriveFileService.uploadFile(url, "image", true);

        } else throw new Exception("File type error");
    }

    @Override
    public void removeImg(String id) throws Exception {

        googleDriveFileService.deleteFile(id);
    }
}
