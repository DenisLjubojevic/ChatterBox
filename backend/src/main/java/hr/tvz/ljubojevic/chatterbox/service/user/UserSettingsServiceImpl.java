package hr.tvz.ljubojevic.chatterbox.service.user;

import hr.tvz.ljubojevic.chatterbox.model.UserSettings;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.UserSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSettingsServiceImpl implements UserSettingsService{
    @Autowired
    private UserSettingRepository userSettingsRepository;

    @Override
    public Optional<UserSettings> getUserSettings(Long userId) {
        return userSettingsRepository.findByUserId(userId);
    }

    @Override
    public UserSettings saveOrUpdateUserSettings(UserSettings userSettings){
        Optional<UserSettings> existingUserSettings = userSettingsRepository.findByUserId(userSettings.getUserId());
        if(existingUserSettings.isPresent()){
            UserSettings settings = existingUserSettings.get();
            settings.setShowOnlineStatus(userSettings.isShowOnlineStatus());
            settings.setProfileVisibility(userSettings.isProfileVisibility());
            settings.setLanguage(userSettings.getLanguage());
            settings.setThemeColor(userSettings.getThemeColor());
            return userSettingsRepository.save(settings);
        }else{
            return userSettingsRepository.save(userSettings);
        }
    }

}
