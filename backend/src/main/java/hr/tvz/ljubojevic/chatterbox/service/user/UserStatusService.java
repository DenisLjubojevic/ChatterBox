package hr.tvz.ljubojevic.chatterbox.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserStatusService {
    private static final String ONLINE_STATUS_PREFIX = "user:status:";
    private final RedisTemplate<String, String> redisTemplate;


    @Autowired
    public UserStatusService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setUserStatus(Long userId, String status) {
        try {
            redisTemplate.opsForValue().set(ONLINE_STATUS_PREFIX + userId, status);
        } catch (RedisConnectionFailureException e) {
            System.err.println("Error connecting to Redis: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
        }
    }

    public String getUserStatus(Long userId) {
        try {
            return redisTemplate.opsForValue().get(ONLINE_STATUS_PREFIX + userId);
        } catch (RedisConnectionFailureException e) {
            System.err.println("Error connecting to Redis: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return null;
        }
    }
}
