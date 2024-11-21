package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.model.UserSettings;
import hr.tvz.ljubojevic.chatterbox.service.user.UserSettingsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/user/settings")
public class UserSettingsController {
    @Autowired
    private UserSettingsService userSettingsService;

    @GetMapping("/get/{userId}")
    public ResponseEntity<UserSettings> getUserSettings(@PathVariable("userId") Long userId) {
        Optional<UserSettings> userSettings = userSettingsService.getUserSettings(userId);
        return ResponseEntity.status(HttpStatus.OK).body(userSettings.get());
    }

    @PutMapping("/update")
    public ResponseEntity<UserSettings> updateUserSettings(@RequestBody UserSettings userSettings) {
        UserSettings updatedUserSetting = userSettingsService.saveOrUpdateUserSettings(userSettings);
        return ResponseEntity.status(HttpStatus.OK).body(updatedUserSetting);
    }


}
