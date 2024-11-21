package hr.tvz.ljubojevic.chatterbox.repository;

import hr.tvz.ljubojevic.chatterbox.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUserId(Long userId);
}
