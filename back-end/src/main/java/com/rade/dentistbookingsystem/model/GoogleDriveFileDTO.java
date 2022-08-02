package com.rade.dentistbookingsystem.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@EqualsAndHashCode()
@Getter
@Setter
public class GoogleDriveFileDTO implements Serializable {
    private String id;
    private String name;
    private String link;
    private String size;
    private String thumbnailLink;
    private boolean shared;
}
