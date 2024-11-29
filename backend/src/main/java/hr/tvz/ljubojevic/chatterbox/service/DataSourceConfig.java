package hr.tvz.ljubojevic.chatterbox.service;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        String databaseUrl = System.getenv("MYSQL_URL");
        if (databaseUrl == null || databaseUrl.isEmpty()) {
            throw new IllegalArgumentException("Environment variable DATABASE_URL is not set.");
        }

        URI dbURI = new URI(databaseUrl);
        String userInfo = dbURI.getUserInfo();
        String username = userInfo.split(":")[0];
        String password = userInfo.split(":")[1];

        String jdbcUrl = "jdbc:mysql://" + dbURI.getHost() + ":" + dbURI.getPort() + dbURI.getPath() +
                "?useSSL=false&serverTimezone=UTC";

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        return dataSource;
    }
}
