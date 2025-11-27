package modules.service.impl;

import modules.dto.chat.ChatRequest;
import modules.repository.ProductRepository;
import modules.service.ChatService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {
    private final ChatClient chatClient;
    private final ProductRepository repository;
    private final ConversationMemory conversationMemory;

    public ChatServiceImpl(ChatClient.Builder chatClient,
                           ProductRepository repository,
                           ConversationMemory conversationMemory) {
        this.chatClient = chatClient.build();
        this.repository = repository;
        this.conversationMemory = conversationMemory;
    }

    @Override
    public String chatBot(ChatRequest request) {

        String userId = "default_user";
        List<Document> documents = repository.findAll().stream()
                .map(product -> {
                    int totalStock = product.getVariants() != null
                            ? product.getVariants().stream()
                            .mapToInt(v -> v.getInStock() != null ? v.getInStock() : 0)
                            .sum()
                            : 0;

                    String productInfo = String.format("""
                        Name: %s
                        Price: %.2f
                        Stock: %d
                        Brand: %s
                        """,
                            product.getName(),
                            (double) product.getPrice(),
                            totalStock,
                            product.getBrand()
                    );
                    return Document.builder().id(product.getId().toString()).text(productInfo).build();
                })
                .collect(Collectors.toList());

        String productContext = documents.stream()
                .map(Document::getText)
                .collect(Collectors.joining(System.lineSeparator()));
        List<String> history = conversationMemory.get(userId);
        String historyContext = String.join("\n", history);
        SystemMessage systemMessage = new SystemMessage("""
                You are STYLENEST.AI.
                
                HISTORY OF CONVERSATION:
                %s
                
                PRODUCT DATA:
                %s
                
                Use the above history and product data to answer the user's question.
                """.formatted(historyContext, productContext));

        UserMessage userMessage = new UserMessage(request.getMessage());
        Prompt prompt = new Prompt(systemMessage, userMessage);

        String aiResponse = chatClient.prompt(prompt)
                .call()
                .content();
        conversationMemory.add(userId, "User: " + request.getMessage());
        conversationMemory.add(userId, "AI: " + aiResponse);

        return aiResponse;
    }
}