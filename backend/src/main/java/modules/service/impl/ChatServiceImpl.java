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

    public ChatServiceImpl(ChatClient.Builder chatClient, ProductRepository repository) {
        this.chatClient = chatClient.build();
        this.repository = repository;
    }

    @Override
    public String chatBot(ChatRequest request) {
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
                        Material: %s
                        Origin: %s
                        """,
                            product.getName(),
                            product.getPrice(),
                            totalStock,
                            product.getBrand(),
                            product.getMaterial(),
                            product.getOrigin()
                    );

                    // Tạo một Spring AI Document
                    return Document.builder()
                            .id(product.getId().toString())
                            .text(productInfo)
                            .build();
                })
                .collect(Collectors.toList());

        String context = documents.stream()
                .map(Document::getText)
                .collect(Collectors.joining(System.lineSeparator()));

        SystemMessage systemMessage = new SystemMessage("""
                                        You are STYLENEST.AI.
                                        Use the following context from the database to answer the user's question:
                                        %s
                                        """.formatted(context));

        UserMessage userMessage = new UserMessage(request.getMessage());

        Prompt prompt = new Prompt(systemMessage, userMessage);

        return chatClient.prompt(prompt)
                .call()
                .content();
    }
}