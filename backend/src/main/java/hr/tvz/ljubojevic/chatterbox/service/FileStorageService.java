package hr.tvz.ljubojevic.chatterbox.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${imgur.client-id}")
    private String imgurClientId;

    private final RestTemplate restTemplate;

    private static final String IMGUR_API_URL = "https://api.imgur.com/3/image";

    public FileStorageService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String storeFile(MultipartFile file) {
        System.out.println("Storing files...");
        try{
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Client-ID " + imgurClientId);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", file.getBytes());

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(IMGUR_API_URL, HttpMethod.POST, requestEntity, Map.class);

            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            String imageUrl = (String) data.get("link");

            return imageUrl;

            /*
            * Files.createDirectories(fileStorageLocation);
            String fileName = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/")
                    .path(fileName)
                    .toUriString();*/
        }catch(IOException e){
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deleteFile(String imageUrl) {
        System.out.println("Deleting files...");
        try{
            String imageId = imageUrl.split("/")[4].split("\\.")[0];

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Client-ID " + imgurClientId);

            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            String deleteUrl = "https://api.imgur.com/3/image/" + imageId;
            restTemplate.exchange(deleteUrl, HttpMethod.DELETE, requestEntity, String.class);


            /*String fileName = Paths.get(new URL(fileUrl).getPath()).getFileName().toString();
            Path filePath  = fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);*/
        }catch(Exception e){
            throw new RuntimeException("Failed to delete file", e);
        }
    }
}
