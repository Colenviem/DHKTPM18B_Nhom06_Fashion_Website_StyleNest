package modules.service.impl;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ConversationMemory {

    private final Map<String, List<String>> history = new ConcurrentHashMap<>();

    public void add(String userId, String msg) {
        history.computeIfAbsent(userId, k -> new ArrayList<>()).add(msg);

        List<String> userHistory = history.get(userId);
        if (userHistory.size() > 20) {
            userHistory.remove(0);
        }
    }
    public List<String> get(String userId) {
        return new ArrayList<>(history.getOrDefault(userId, new ArrayList<>()));
    }
    public void clear(String userId) {
        history.remove(userId);
    }
}