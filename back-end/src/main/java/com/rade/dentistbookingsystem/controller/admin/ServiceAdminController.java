package com.rade.dentistbookingsystem.controller.admin;

import com.rade.dentistbookingsystem.componentform.ServiceFilter;
import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.model.ServiceDTO;
import com.rade.dentistbookingsystem.services.ServiceSv;
import com.rade.dentistbookingsystem.services.ServiceTypeSv;
import com.rade.dentistbookingsystem.utils.image.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("rade/admin/service")
public class ServiceAdminController {
    @Autowired
    ServiceSv serviceSv;
    @Autowired
    ServiceTypeSv serviceTypeSv;
    @Autowired
    ImageService imageService;


    // những hàm cho service
    @GetMapping("/{id}")
    public Optional<Service> findByID(@PathVariable int id) {
        return serviceSv.findById(id);
    }

    @PostMapping("filter")
    public List<Service> filter(@RequestBody ServiceFilter serviceFilter) {
        return serviceSv.filterService(serviceFilter);
    }

    @PostMapping(value = "add-image")
    public ResponseEntity<?> addServiceImg(@RequestParam MultipartFile url) throws Exception {
        String id = imageService.validateAndDownload(url);
        if (id != null)
            return ResponseEntity.ok(id); // lấy id gán vào cột url của serviceDTO sẽ gửi lên requeest
        else
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @PostMapping(value = "add-service")
    public ResponseEntity<?> addService(@Valid @RequestBody ServiceDTO serviceDTO) throws Exception {
        Service service = serviceSv.insert(serviceDTO);
        if (service != null)
            return ResponseEntity.ok(service);
        else {
            imageService.removeImg(serviceDTO.getUrl());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }

    }

    @PostMapping("edit")
    public ResponseEntity<?> editService(@Valid @RequestBody ServiceDTO serviceDTO) throws Exception {
        Service service = serviceSv.edit(serviceDTO);
        if (service != null)
            return ResponseEntity.ok(service);
        else {
           // imageService.removeImg(serviceDTO.getUrl());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }

    }

    @GetMapping("delete/{id}")
    public ResponseEntity<?> deleteService(@PathVariable int id) {
        return ResponseEntity.ok(serviceSv.deleteService(id));
    }


    // Hàm trả về ServiceComponent cho admin bao gồm servcie va service type


    @GetMapping("list")
    public List<Service> loadServiceComponent() {
        return serviceSv.findAll();
    }

    // Pagination
    @GetMapping("page")
    public Page<Service> findAllWithPagination() {
        return serviceSv.findAllWithPagination();
    }

    @GetMapping("page/{field}")
    public Page<Service> findAllWithPagination(@PathVariable String field) {
        return serviceSv.findAllWithPaginationAndSorting(field);
    }
}
