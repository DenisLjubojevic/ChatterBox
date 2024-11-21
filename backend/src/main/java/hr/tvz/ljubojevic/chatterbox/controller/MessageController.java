package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.DTO.ChatRoomDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.MessageDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.MessageRequestDTO;
import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.service.chatRoom.ChatRoomService;
import hr.tvz.ljubojevic.chatterbox.service.message.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/message")
public class MessageController {
    private final MessageService messageService;
    private final ChatRoomService chatRoomService;

    @GetMapping("/chat/{chatName}")
    public List<MessageDTO> findByChatName(@PathVariable String chatName) {
        Optional<ChatRoomDTO> chatRoom = chatRoomService.findChatRoomByName(chatName);
        return messageService.findByChatRoom(chatRoomService.convertChatRoomDTOToChatRoom(chatRoom.get()));
    }

    @PostMapping("/sendFriend/{friendUsername}")
    public MessageDTO sendFriendMessage(@RequestBody MessageDTO message,
                                        @PathVariable String friendUsername,
                                        @AuthenticationPrincipal UserDetails user){
        System.out.println("F name - " + message.getContent() +
                "; content - " + message.getContent());

        return messageService.sendMessageToFriend(user.getUsername(), friendUsername, message.getContent());
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete/{id}")
    public void deleteMessage(@PathVariable Long id) {
        messageService.deleteById(id);
    }

    public void deleteMessageByChatId(ChatRoomDTO chatRoomDTO) {
        ChatRoom chatRoom = this.chatRoomService.convertChatRoomDTOToChatRoom(chatRoomDTO);
        messageService.deleteByChatRoom(chatRoom);
    }
}
