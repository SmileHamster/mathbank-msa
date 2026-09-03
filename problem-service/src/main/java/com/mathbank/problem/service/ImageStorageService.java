package com.mathbank.problem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String store(MultipartFile file, Long problemId) {
        try {
            Path dir = Path.of(uploadDir, "problems", String.valueOf(problemId));
            Files.createDirectories(dir);

            String original = file.getOriginalFilename();
            String ext = (original != null && original.contains("."))
                    ? original.substring(original.lastIndexOf('.'))
                    : "";
            String filename = UUID.randomUUID() + ext;

            Path target = dir.resolve(filename);
            file.transferTo(target);

            return "problems/" + problemId + "/" + filename;
        } catch (IOException e) {
            throw new UncheckedIOException("이미지 저장에 실패했습니다.", e);
        }
    }

    public void delete(String imagePath) {
        if (imagePath == null || imagePath.isBlank()) return;
        try {
            Files.deleteIfExists(Path.of(uploadDir, imagePath));
        } catch (IOException e) {
            throw new UncheckedIOException("이미지 삭제에 실패했습니다.", e);
        }
    }

    public Path resolve(String relativePath) {
        return Path.of(uploadDir, relativePath);
    }
}
