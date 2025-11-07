package modules.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {
    static {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("GEMINI_KEY", dotenv.get("GEMINI_KEY"));
    }
}