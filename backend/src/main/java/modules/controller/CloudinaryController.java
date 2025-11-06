package modules.controller;

import modules.service.impl.CloudinaryServiceIml;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
@RestController
@RequestMapping("/api/cloudinary")
public class CloudinaryController {
    private final CloudinaryServiceIml cloudinaryServiceIml;

    public CloudinaryController(CloudinaryServiceIml cloudinaryServiceIml) {
        this.cloudinaryServiceIml = cloudinaryServiceIml;
    }

    @PostMapping("/uploadImage")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        try {
            String imageUrl = cloudinaryServiceIml.uploadImage(file);
            return imageUrl;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Upload thất bại", e);
        }
    }
}
