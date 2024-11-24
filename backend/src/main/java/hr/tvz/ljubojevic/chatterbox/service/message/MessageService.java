package hr.tvz.ljubojevic.chatterbox.service.message;

import hr.tvz.ljubojevic.chatterbox.DTO.MessageDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.MessageRequestDTO;
import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.Message;

import java.util.List;
import java.util.Optional;

public interface MessageService {
    Optional<MessageDTO> findById(Long id);

    List<MessageDTO> findByChatRoom(ChatRoom chatRoom);

    List<MessageDTO> findMessageByChatRoomPaginated(ChatRoom chatRoom, int offset, int limit);

    void deleteById(Long id);

    MessageRequestDTO sendMessage(Long chatRoomId, Long userId, String content);

    MessageDTO sendMessageToFriend(String senderUsername, String recipientUsername, String content);

    void deleteByChatRoom(ChatRoom chatRoom);

    MessageDTO convertMessageToMessageDTO(Message message);

    Message convertMessageDTOToMessage(MessageDTO messageDTO);
}
