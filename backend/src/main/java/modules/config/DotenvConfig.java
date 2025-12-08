package modules.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    static {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")         // thư mục gốc
                .filename(".env")        // tên file
                .ignoreIfMissing()       // không lỗi nếu không có file
                .load();

        dotenv.entries().forEach(entry -> {
            if (entry.getValue() != null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });
    }
}