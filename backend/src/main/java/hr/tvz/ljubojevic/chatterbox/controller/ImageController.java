package hr.tvz.ljubojevic.chatterbox.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/images")
public class ImageController {
    private final RestTemplate restTemplate;

    public ImageController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        String imageUrl = "https://i.imgur.com/" + filename;
        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(imageUrl, HttpMethod.GET, null, byte[].class);

            String contentType = response.getHeaders().getContentType().toString();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        /*try {
            Path file = Paths.get("/images").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                return ResponseEntity.ok()
                        .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }*/
    }
}
