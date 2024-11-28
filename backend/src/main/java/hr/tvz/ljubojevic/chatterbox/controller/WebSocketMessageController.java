package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.DTO.MessageRequestDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.WebSocketMessageDTO;
import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.repository.UserRepository;
import hr.tvz.ljubojevic.chatterbox.service.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class WebSocketMessageController {
    private final MessageService messageService;
    private final UserRepository userRepository;

    @Autowired
    final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/messages")
    public void sendMessage(MessageRequestDTO message) {
        System.out.println("SENDING MESSAGE - " + message.getMessageContent());
        System.out.println(message);

        User user = userRepository.findByUsername(message.getSenderUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        MessageRequestDTO savedMessage = messageService.sendMessage(message.getChatRoomId(), user.getId(), message.getMessageContent());




        WebSocketMessageDTO response = new WebSocketMessageDTO(
                "NEW_MESSAGE",
                new WebSocketMessageDTO.WebSocketMessageData(
                        savedMessage.getChatRoomId(),
                        user.getUsername(),
                        savedMessage.getMessageContent(),
                        savedMessage.getTimestamp()
                )
        );

        messagingTemplate.convertAndSend("/topic/messages", response);
    }

    public void sendStatusUpdate(Long userId, String status) {
        Map<String, String> update = new HashMap<>();
        update.put("userId", userId.toString());
        update.put("status", status);

        messagingTemplate.convertAndSend("/topic/user-status", update);
    }
}
