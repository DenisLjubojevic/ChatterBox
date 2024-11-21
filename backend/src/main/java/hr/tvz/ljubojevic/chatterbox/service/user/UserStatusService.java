package hr.tvz.ljubojevic.chatterbox.service.user;

import org.springframework.beans.factory.annotation.Autowired;
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
        redisTemplate.opsForValue().set(ONLINE_STATUS_PREFIX + userId, status);
    }

    public String getUserStatus(Long userId) {
        return redisTemplate.opsForValue().get(ONLINE_STATUS_PREFIX + userId);
    }
}
