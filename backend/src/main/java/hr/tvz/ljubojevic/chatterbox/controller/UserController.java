package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.DTO.UserDTO;
import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.service.user.UserService;
import hr.tvz.ljubojevic.chatterbox.service.user.UserStatusService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    private UserService userService;
    private UserStatusService userStatusService;

    @GetMapping("/all/{username}")
    public Optional<UserDTO> getUserByUsername(@PathVariable String username) {
        log.info("getUserByUsername called");
        return userService.findByUsername(username);
    }

    @GetMapping("/userId/{id}")
    public Optional<UserDTO> getUserById(@PathVariable Long id) {
        log.info("getUserById called");
        return Optional.of(userService.convertUserToDTO(userService.findById(id).get()));
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<String> getUserStatus(@PathVariable Long userId) {
        String status = userStatusService.getUserStatus(userId);
        if (status == null) {
            status = "offline";
        }
        return ResponseEntity.ok(status);
    }
    @GetMapping("/status/all")
    public ResponseEntity<Map<Long, String>> getUserStatusAll() {
        Map<Long, String> statuses = new HashMap<>();

        List<User> users = userService.findAll();

        for (User user : users) {
            String status = userStatusService.getUserStatus(user.getId());
            statuses.put(user.getId(), status != null ? status : "offline");
        }

        return ResponseEntity.ok(statuses);
    }

    @PostMapping("/create")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        System.out.println("createUser called");
        UserDTO createdUser = this.userService.createNewUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        log.info("updateUser called");
        if (!userDTO.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        try{
            UserDTO updatedUser = userService.updateUser(userDTO);
            return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
        }catch(RuntimeException e){
            log.warn("The user must not be empty!");
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/{userId}/upload-picture")
    public ResponseEntity<String> uploadPicture(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        System.out.println("Uploading picture");
        String pictureUrl = userService.uploadUserPicture(userId, file);

        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(pictureUrl);
    }

    @PostMapping("/{userId}/add-friend/{friendId}")
    public ResponseEntity<UserDTO> addFrined(@PathVariable Long userId, @PathVariable Long friendId) {
        System.out.println("Adding friends");
        UserDTO changedUser = userService.addFriend(userId, friendId);
        return ResponseEntity.status(HttpStatus.OK).body(changedUser);
    }

    @DeleteMapping("/{userId}/remove-friend/{friendId}")
    public ResponseEntity<UserDTO> removeFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        System.out.println("Removing friends");
        UserDTO changedUser = userService.removeFriend(userId, friendId);
        return ResponseEntity.status(HttpStatus.OK).body(changedUser);
    }

    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<UserDTO>> getFriends(@PathVariable Long userId) {
        System.out.println("Getting friends");
        List<UserDTO> friendsDTO = userService.getFriends(userId).stream()
                .map(friend -> userService.convertUserToDTO(friend))
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(friendsDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam("query") String query) {
        System.out.println("Searching friends");
        List<User> users = userService.searchUsersByName(query);
        List<UserDTO> usersDTO = new ArrayList<>();
        users.forEach(user -> usersDTO.add(userService.convertUserToDTO(user)));
        return ResponseEntity.status(HttpStatus.OK).body(usersDTO);
    }
}
