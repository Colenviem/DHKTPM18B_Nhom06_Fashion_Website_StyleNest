package modules.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {
//    static {
//        Dotenv dotenv = Dotenv.load();
//        System.setProperty("GEMINI_KEY", dotenv.get("GEMINI_KEY"))cd ..;
//    }
    static {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .filename(".env")
                .ignoreIfMissing()
                .load();

        if (dotenv.get("GEMINI_KEY") != null) {
            System.setProperty("GEMINI_KEY", dotenv.get("GEMINI_KEY"));
        }
}
}