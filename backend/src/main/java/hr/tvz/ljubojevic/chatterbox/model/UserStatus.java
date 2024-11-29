package hr.tvz.ljubojevic.chatterbox.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

@Data
@AllArgsConstructor

@RedisHash("UserStatus")
public class UserStatus {
    private String userId;
    private String status;
}
