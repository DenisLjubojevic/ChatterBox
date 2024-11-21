package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.DTO.ChatRoomDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.UserDTO;
import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.service.chatRoom.ChatRoomService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/chat")
public class ChatRoomController {
    private ChatRoomService chatRoomService;

    @PostMapping("/create")
    public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody ChatRoomDTO chatRoom,
                                                      @AuthenticationPrincipal UserDetails user) {
        System.out.println("createChatRoom called!");
        ChatRoomDTO chatRoomDTO = chatRoomService.createChatRoom(chatRoom, user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(chatRoomDTO);
    }

    @PostMapping("/create-closed/{friendUsername}")
    public ResponseEntity<ChatRoomDTO> createChatRoomClosed(@PathVariable String friendUsername,
                                                            @AuthenticationPrincipal UserDetails user) {
        System.out.println("User - " + user.getUsername() +
                "; friend - " + friendUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(chatRoomService.createClosedChatRoom(user.getUsername(), friendUsername));
    }

    @GetMapping("/all")
    public List<ChatRoomDTO> getAllChatRooms() {
        System.out.println("getAllChatRooms called!");
        return chatRoomService.findAllChatRooms();
    }

    @GetMapping("/closed/{recipientUsername}")
    public Optional<ChatRoomDTO> getClosedChatRoom(@PathVariable String recipientUsername,
                                                @AuthenticationPrincipal UserDetails user) {
        System.out.println("getClosedChatRooms called!");
        Optional<ChatRoom> closedChatRooms = chatRoomService.findClosedChatRoomBetweenUsers(user.getUsername(), recipientUsername);
        if (closedChatRooms.isPresent()) {
            return Optional.of(chatRoomService.convertChatRoomToChatRoomDTO(closedChatRooms.get()));
        }else{
            return Optional.empty();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatRoomDTO>> getChatRoomsForUser(@PathVariable Long userId) {
        List<ChatRoomDTO> chatRoomDTO = this.chatRoomService.getChatRoomByMemberId(userId);
        return ResponseEntity.status(HttpStatus.OK).body(chatRoomDTO);
    }

    @GetMapping("/name/{name}")
    public Optional<ChatRoomDTO> getChatRoomByName(@PathVariable String name) {
        System.out.println("getChatRoomByName called!");
        return chatRoomService.findChatRoomByName(name);
    }

    @GetMapping("/id/{id}")
    public Optional<ChatRoomDTO> getChatRoomById(@PathVariable Long id) {
        System.out.println("getChatRoomById called!");
        return chatRoomService.findChatRoomById(id);
    }

    @GetMapping("/{chatRoomId}/members")
    public ResponseEntity<List<UserDTO>> getMembersOfChat(@PathVariable Long chatRoomId) {
        System.out.println("getMembersOfChat called!");
        return ResponseEntity.status(HttpStatus.OK).body(chatRoomService.getMembersOfChat(chatRoomId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ChatRoomDTO> updateChatRoom(@PathVariable Long id, @RequestBody ChatRoomDTO chatRoomDTO) {
        System.out.println("updateChatRoom called!");

        if (!chatRoomDTO.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        try{
            ChatRoomDTO updatedChat = chatRoomService.updateChatRoom(chatRoomDTO);
            return ResponseEntity.status(HttpStatus.OK).body(updatedChat);
        }catch (RuntimeException e){
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/{chatRoomId}/upload-picture")
    public ResponseEntity<String> uploadPicture(@PathVariable Long chatRoomId, @RequestParam("file") MultipartFile file) {
        String pictureUrl = chatRoomService.uploadChatRoomPicture(chatRoomId, file);
        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(pictureUrl);
    }

    @PostMapping("/new-picture")
    public ResponseEntity<String> newPicture(@RequestParam("file") MultipartFile file) {
        System.out.println("newPicture called!");
        String pictureUrl = chatRoomService.storeNewPicture(file);
        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(pictureUrl);

    }

    @GetMapping("/search")
    public ResponseEntity<List<ChatRoomDTO>> searchChatRoom(@RequestParam("query") String query) {
        System.out.println("searching public groups!");
        List<ChatRoom> chatRooms = chatRoomService.searchPublicChatRoomsByName(query);
        List<ChatRoomDTO> chatRoomDTOs = new ArrayList<>();
        for (ChatRoom chatRoom : chatRooms) {
            chatRoomDTOs.add(chatRoomService.convertChatRoomToChatRoomDTO(chatRoom));
        }
        return ResponseEntity.status(HttpStatus.OK).body(chatRoomDTOs);
    }

    @PostMapping("/{chatRoomId}/join")
    public ResponseEntity<String> joinChatRoom(@PathVariable Long chatRoomId, @RequestParam("userId") Long userId) {
        String result = chatRoomService.joinChatRoom(chatRoomId, userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{chatRoomId}/leave")
    public ResponseEntity<String> leaveChatRoom(@PathVariable Long chatRoomId, @RequestParam("userId") Long userId) {
        String result = chatRoomService.leaveChatRoom(chatRoomId, userId);
        return ResponseEntity.ok(result);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete/{id}")
    public void deleteChatRoom(@PathVariable Long id) {
        System.out.println("deleteChatRoom called!");
        chatRoomService.deleteChatRoomById(id);
    }
}
