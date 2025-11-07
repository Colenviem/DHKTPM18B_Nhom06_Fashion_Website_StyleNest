package modules.service;

import modules.dto.chat.ChatRequest;

public interface ChatService {
    String chatBot(ChatRequest request);
}
