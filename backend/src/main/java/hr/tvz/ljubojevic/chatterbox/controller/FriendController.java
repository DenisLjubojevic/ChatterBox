package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.DTO.FriendRequestDTO;
import hr.tvz.ljubojevic.chatterbox.model.FriendRequests;
import hr.tvz.ljubojevic.chatterbox.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;

@RestController
@RequestMapping("/friends")
public class FriendController {
    @Autowired
    private UserService userService;

    @PostMapping("/sendRequest")
    public ResponseEntity<String> sendFriendRequest(@RequestParam Long senderId, @RequestParam Long recipientId) {
        System.out.println("SENDING REQUEST...");
        return ResponseEntity.ok(userService.sendFriendRequest(senderId, recipientId));
    }

    @PostMapping("/acceptRequest")
    public ResponseEntity<String> acceptFriendRequest(@RequestParam Long requestId) {
        return ResponseEntity.ok(userService.acceptFriendRequest(requestId));
    }

    @PostMapping("/denyRequest")
    public ResponseEntity<String> denyFriendRequest(@RequestParam Long requestId) {
        return ResponseEntity.ok(userService.denyFriendRequest(requestId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FriendRequestDTO>> getPendingRequestsForUser(Long userId) {
        System.out.println("USER_ID - " + userId);
        List<FriendRequests> friendRequests = userService.getPendingRequestsForUser(userId);

        List<FriendRequestDTO> friendRequestDTO = friendRequests.stream().map(this::convertFriendRequestToDTO).toList();
        return ResponseEntity.ok(friendRequestDTO);
    }

    public FriendRequestDTO convertFriendRequestToDTO(FriendRequests friendRequests) {
        LocalDateTime createdDateLDT = friendRequests.getCreatedDate();
        String createdDate = createdDateLDT != null ? createdDateLDT.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null;

        return new FriendRequestDTO(
                friendRequests.getId(),
                friendRequests.getSender(),
                friendRequests.getRecipient(),
                friendRequests.getStatus(),
                createdDate
        );
    }
}
