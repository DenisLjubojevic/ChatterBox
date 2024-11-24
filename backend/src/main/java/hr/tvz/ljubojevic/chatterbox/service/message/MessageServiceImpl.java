package hr.tvz.ljubojevic.chatterbox.service.message;

import hr.tvz.ljubojevic.chatterbox.DTO.MessageDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.MessageRequestDTO;
import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.Message;
import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.repository.ChatRoomRepository;
import hr.tvz.ljubojevic.chatterbox.repository.MessageRepository;
import hr.tvz.ljubojevic.chatterbox.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public MessageRequestDTO sendMessage(Long chatRoomId, Long userId, String content){
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        Message message = new Message();
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setUser(user);
        message.setChatRoom(chatRoom);

        messageRepository.save(message);

        chatRoom.setLastMessageTimestamp(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);

        return new MessageRequestDTO(
                chatRoom.getId(),
                user.getUsername(),
                message.getContent(),
                message.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
    }

    @Override
    public MessageDTO sendMessageToFriend(String senderUsername, String recipientUsername, String content){
        ChatRoom chatRoom = chatRoomRepository.FindClosedChatRoomBetweenFriends(senderUsername, recipientUsername)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        Message message = new Message();
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setUser(sender);
        message.setChatRoom(chatRoom);
        messageRepository.save(message);

        return convertMessageToMessageDTO(message);
    }


    @Override
    public Optional<MessageDTO> findById(Long id) {
        return messageRepository.findById(id).stream()
                .map(this::convertMessageToMessageDTO)
                .findFirst();
    }

    @Override
    public List<MessageDTO> findByChatRoom(ChatRoom chatRoom) {
        return messageRepository.findByChatRoom(chatRoom).stream()
                .map(this::convertMessageToMessageDTO)
                .toList();
    }

    @Override
    public List<MessageDTO> findMessageByChatRoomPaginated(ChatRoom chatRoom, int offset, int limit) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        return messageRepository.findByChatRoomOrderByTimestampDesc(chatRoom, pageable).stream()
                .map(this::convertMessageToMessageDTO)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        messageRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteByChatRoom(ChatRoom chatRoom) {
        messageRepository.deleteMsg(chatRoom.getId());
    }

    @Override
    @Transactional
    public MessageDTO convertMessageToMessageDTO(Message message){
        LocalDateTime timestamp = message.getTimestamp();
        String timestampString = timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return new MessageDTO(
                message.getId(),
                message.getContent(),
                timestampString,
                message.getUser(),
                message.getChatRoom()
        );
    }

    @Override
    public Message convertMessageDTOToMessage(MessageDTO messageDTO){
        User user = userRepository.findById(messageDTO.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));;
        ChatRoom chatRoom = chatRoomRepository.findChatRoomById(messageDTO.getChatRoom().getId())
                .orElseThrow(() -> new UsernameNotFoundException("Chat room not found"));

        String timestampString = messageDTO.getTimestamp();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime timestamp = LocalDateTime.parse(timestampString, formatter);

        return new Message(
                messageDTO.getId(),
                messageDTO.getContent(),
                timestamp,
                user,
                chatRoom
        );
    }

}
