package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.DTO.ChatInvitationDTO;
import hr.tvz.ljubojevic.chatterbox.model.ChatInvitation;
import hr.tvz.ljubojevic.chatterbox.service.chatRoom.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/chat-invitation")
public class ChatInvitationController {
    @Autowired
    private ChatRoomService chatService;

    @PostMapping("/sendInvitation")
    public ResponseEntity<String> sendChatInvitation(@RequestParam Long senderId,
                                                     @RequestParam Long recipientId,
                                                     @RequestParam Long chatId){
        System.out.println("SENDING CHAT INVITATION...");
        return ResponseEntity.ok(chatService.sendChatInvitation(senderId, recipientId, chatId));
    }

    @PostMapping("/acceptInvitation")
    public ResponseEntity<String> acceptInvitation(@RequestParam Long invitationId){
        System.out.println("ACCEPTING CHAT INVITATION...");
        return ResponseEntity.ok(chatService.acceptInvite(invitationId));
    }

    @PostMapping("/denyInvitation")
    public ResponseEntity<String> denyInvitation(@RequestParam Long invitationId){
        System.out.println("DENYING CHAT INVITATION...");
        return ResponseEntity.ok(chatService.denyInvite(invitationId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ChatInvitationDTO>> getPendingChatInvitations(Long userId){
        System.out.println("PENDING CHAT INVITATION...");
        System.out.println("USER_ID - " + userId);
        List<ChatInvitation> chatInvitations = chatService.getPendingInvitation(userId);
        List<ChatInvitationDTO> chatInvitationDTOS = chatInvitations.stream().map(this::convertChatInvitationToDTO).toList();
        return ResponseEntity.ok(chatInvitationDTOS);
    }

    public ChatInvitationDTO convertChatInvitationToDTO(ChatInvitation chatInvitation){
        LocalDateTime createdDateLDT = chatInvitation.getCreatedDate();
        String createdDate = createdDateLDT != null ? createdDateLDT.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null;

        return new ChatInvitationDTO(
                chatInvitation.getId(),
                chatInvitation.getSender(),
                chatInvitation.getRecipient(),
                chatInvitation.getChat(),
                chatInvitation.getStatus(),
                createdDate
        );
    }

}
