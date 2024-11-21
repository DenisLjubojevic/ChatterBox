package hr.tvz.ljubojevic.chatterbox.repository;

import hr.tvz.ljubojevic.chatterbox.model.RefreshToken;
import hr.tvz.ljubojevic.chatterbox.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    int deleteByUser(User user);
}
