package modules.service;

import modules.dto.chat.ChatRequest;
import org.springframework.stereotype.Service;

@Service
public interface ChatService {
    String chatBot(ChatRequest request);
}
