package hr.tvz.ljubojevic.chatterbox;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = {RedisAutoConfiguration.class})
@EnableJpaRepositories(basePackages = "hr.tvz.ljubojevic.chatterbox.repository")
public class ChatterBoxApplication {

	public static void main(String[] args) {
		String activeProfile = System.getenv("APP_PROFILE");

		if (activeProfile == null) {
			activeProfile = "dev";
		}

		if (activeProfile.equals("dev")) {
			Dotenv dotenv = Dotenv.configure()
					.directory("../")
					.load();


			System.setProperty("MYSQL_HOST", dotenv.get("MYSQL_HOST"));
			System.setProperty("MYSQL_PORT", dotenv.get("MYSQL_PORT"));
			System.setProperty("MYSQL_DATABASE", dotenv.get("MYSQL_DATABASE"));
			System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
			System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
			System.setProperty("REDIS_HOST", dotenv.get("REDIS_HOST"));
			System.setProperty("REDIS_PORT", dotenv.get("REDIS_PORT"));
			System.setProperty("REDIS_PASSWORD", dotenv.get("REDIS_PASSWORD"));
		}

		System.setProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, activeProfile);

		SpringApplication.run(ChatterBoxApplication.class, args);
	}
}
