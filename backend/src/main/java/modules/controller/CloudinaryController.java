package modules.controller;

import modules.service.impl.CloudinaryServiceIml;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cloudinary")
@CrossOrigin(origins = "${FRONTEND_URL}")
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
