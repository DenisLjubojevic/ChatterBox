package hr.tvz.ljubojevic.chatterbox.service.user;

import hr.tvz.ljubojevic.chatterbox.DTO.UserDTO;
import hr.tvz.ljubojevic.chatterbox.model.FriendRequests;
import hr.tvz.ljubojevic.chatterbox.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<UserDTO> findByUsername(String username);

    Optional<User> findById(Long id);

    List<User> findAll();

    UserDTO createNewUser(UserDTO userDTO);

    UserDTO updateUser(UserDTO userDTO);

    String uploadUserPicture(Long userId, MultipartFile file);

    List<User> getFriends(Long userId);

    UserDTO addFriend(Long userId, Long friendId);

    UserDTO removeFriend(Long userId, Long friendId);

    List<User> searchUsersByName(String query);

    String sendFriendRequest(Long senderId, Long recipientId);

    String acceptFriendRequest(Long requestId);

    String denyFriendRequest(Long requestId);

    List<FriendRequests> getPendingRequestsForUser(Long userId);

    boolean changePassword(String username, String newPassword);

    boolean deleteAccount(String username);

    UserDTO convertUserToDTO(User user);

    User convertUserDTOToUser(UserDTO userDTO);
}
