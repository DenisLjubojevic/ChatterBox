package hr.tvz.ljubojevic.chatterbox.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private Path fileStorageLocation = Paths.get("uploads/images").toAbsolutePath().normalize();

    public String storeFile(MultipartFile file) {
        System.out.println("Storing files...");
        try{
            Files.createDirectories(fileStorageLocation);
            String fileName = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/")
                    .path(fileName)
                    .toUriString();
        }catch(IOException e){
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deleteFile(String fileUrl) {
        System.out.println("Deleting files...");
        try{
            String fileName = Paths.get(new URL(fileUrl).getPath()).getFileName().toString();
            Path filePath  = fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        }catch(IOException e){
            throw new RuntimeException("Failed to delete file", e);
        }
    }
}
