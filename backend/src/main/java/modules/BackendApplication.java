package modules;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(BackendApplication.class, args);
        Environment env = ctx.getEnvironment();
        System.out.println(">>> spring.mail.host = " + env.getProperty("spring.mail.host"));
        System.out.println(">>> spring.mail.port = " + env.getProperty("spring.mail.port"));
        System.out.println(">>> spring.mail.username = " + env.getProperty("spring.mail.username"));
    }
}
