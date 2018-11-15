package com.kedacom.ezSafe.common.service;

import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.sort.SortOrder;

import java.util.List;
import java.util.Map;

public abstract class AFireExportModel {
    private List<String> columnName;
    private List<String> textName;
    private String dicPath;
    private String fileName;
    private Map<String, Integer> fileId;
    private String progressId;
    private SortOrder sortOrder = null;
    private String sortText = "";

    public String getSortText() {
        return sortText;
    }

    public void setSortText(String sortText) {
        this.sortText = sortText;
    }


    public SortOrder getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(SortOrder sortOrder) {
        this.sortOrder = sortOrder;
    }

    public abstract List<Map<String, Object>> Filter(SearchHit[] hits);

    public AFireExportModel(List<String> columnName, List<String> textName, String dicPath, String fileName, Map fileId, String progressId) {
        this.columnName = columnName;
        this.textName = textName;
        this.dicPath = dicPath;
        this.fileName = fileName;
        this.fileId = fileId;
        this.progressId = progressId;
    }

    public AFireExportModel() {
    }

    public String getFileName() {
        return fileName;
    }

    public String getDicPath() {
        return dicPath;
    }

    public List<String> getTextName() {
        return textName;
    }

    public List<String> getColumnName() {
        return columnName;
    }

    public Map getFileId() {
        return fileId;
    }

    public String getProgressId() {
        return progressId;
    }
}
