package hr.tvz.ljubojevic.chatterbox.service.chatRoom;

import hr.tvz.ljubojevic.chatterbox.DTO.ChatRoomDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.UserDTO;
import hr.tvz.ljubojevic.chatterbox.model.ChatInvitation;
import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ChatRoomService {
    Optional<ChatRoomDTO> findChatRoomById(Long id);

    Optional<ChatRoomDTO> findChatRoomByName(String name);

    List<ChatRoomDTO> findAllChatRooms();

    Optional<ChatRoom> findClosedChatRoomBetweenUsers(String username1, String username2);

    List<ChatRoomDTO> getChatRoomByMemberId(Long userId);

    List<UserDTO> getMembersOfChat(Long chatRoomId);

    ChatRoomDTO createChatRoom(ChatRoomDTO chatRoomDTO, String username);

    ChatRoomDTO createClosedChatRoom(String senderUsername, String recipientUsername);

    ChatRoomDTO updateChatRoom(ChatRoomDTO chatRoomDTO);

    void deleteChatRoomById(Long id);

    String uploadChatRoomPicture(Long chatRoomID, MultipartFile file);

    String storeNewPicture(MultipartFile file);

    List<ChatRoom> searchPublicChatRoomsByName(String name);

    String joinChatRoom(Long chatId, Long userId);

    String leaveChatRoom(Long chatId, Long userId);

    String sendChatInvitation(Long senderId, Long recipientId, Long chatId);

    String acceptInvite(Long inviteId);

    String denyInvite(Long inviteId);

    List<ChatInvitation> getPendingInvitation(Long userId);

    ChatRoomDTO convertChatRoomToChatRoomDTO(ChatRoom chatRoom);

    ChatRoom convertChatRoomDTOToChatRoom(ChatRoomDTO chatRoomDTO);
}
