package modules.controller;

import modules.dto.chat.ChatRequest;
import modules.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
    private final ChatService service;

    public ChatController(ChatService service) {
        this.service = service;
    }

    @PostMapping("/api/chat")
    @ResponseBody
    public String chatWithDatabase(@RequestBody ChatRequest request) {
        return service.chatBot(request);
    }
}
