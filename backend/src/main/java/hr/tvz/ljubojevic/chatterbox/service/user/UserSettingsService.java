package hr.tvz.ljubojevic.chatterbox.service.user;

import hr.tvz.ljubojevic.chatterbox.model.UserSettings;

import java.util.Optional;

public interface UserSettingsService {
    Optional<UserSettings> getUserSettings(Long userId);

    UserSettings saveOrUpdateUserSettings(UserSettings userSettings);
}
