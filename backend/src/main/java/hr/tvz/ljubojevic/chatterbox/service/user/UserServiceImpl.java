package hr.tvz.ljubojevic.chatterbox.service.user;

import hr.tvz.ljubojevic.chatterbox.DTO.FriendsDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.UserDTO;
import hr.tvz.ljubojevic.chatterbox.model.FriendRequests;
import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.repository.FriendRequestsRepository;
import hr.tvz.ljubojevic.chatterbox.repository.UserRepository;
import hr.tvz.ljubojevic.chatterbox.service.FileStorageService;
import hr.tvz.ljubojevic.chatterbox.service.userChat.UserChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private FriendRequestsRepository friendRequestsRepository;
    @Lazy
    @Autowired
    private UserChatService userChatService;

    @Override
    @Transactional
    public Optional<UserDTO> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> convertUserToDTO(user));
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> findAll(){
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public UserDTO createNewUser(UserDTO userDTO){
        List<User> friends = userDTO.getFriends().stream()
                .map(friendsDTO -> userRepository.findByUsername(friendsDTO.getUsername())
                        .orElseThrow(() -> new RuntimeException("Friend not found")))
                .toList();

        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getName());
        user.setPass(passwordEncoder.encode(userDTO.getPass()));
        user.setEmail(userDTO.getEmail());
        user.setDisplayedName(userDTO.getDisplayedName());
        user.setPfpUrl("http://localhost:8080/images/user.png");
        user.setOnline(false);
        user.setLastSeen(LocalDateTime.now());
        user.setRole(userDTO.getRole());
        user.setFriends(friends);

        this.userRepository.save(user);
        return convertUserToDTO(user);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO){
        this.userRepository.save(convertUserDTOToUser(userDTO));
        return userDTO;
    }

    @Override
    public String uploadUserPicture(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        String oldFileUrl = user.getPfpUrl();
        String defaultProfilePicUrl = "http://localhost:8080/images/user.png";

        if (oldFileUrl != null && !oldFileUrl.equals(defaultProfilePicUrl)) {
            fileStorageService.deleteFile(oldFileUrl);
        }

        String fileUrl = fileStorageService.storeFile(file);
        user.setPfpUrl(fileUrl);
        userRepository.save(user);

        return fileUrl;
    }

    @Override
    @Transactional
    public UserDTO addFriend(Long userId, Long friendId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findById(friendId).orElseThrow(() -> new RuntimeException("Friend not found"));

        user.getFriends().add(friend);
        friend.getFriends().add(user);

        userRepository.save(user);
        userRepository.save(friend);
        return convertUserToDTO(user);
    }

    @Override
    @Transactional
    public UserDTO removeFriend(Long userId, Long friendId){
        User user = this.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User friend = this.findById(friendId).orElseThrow(() -> new RuntimeException("Friend not found"));
        User changedUser =  this.userChatService.removeFriendAndDeleteChat(user, friend);
        return convertUserToDTO(changedUser);
    }

    @Override
    public List<User> getFriends(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFriends();
    }

    @Override
    public List<User> searchUsersByName(String query){
        return userRepository.findTop5ByUsernameContainingIgnoreCase(query);
    }

    @Override
    @Transactional
    public String sendFriendRequest(Long senderId, Long recipientId){
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<FriendRequests> existingFriendRequest = friendRequestsRepository.findBySenderAndRecipient(sender, recipient);
        System.out.println("Friend" + existingFriendRequest);

        if (existingFriendRequest.isPresent() && existingFriendRequest.get().getStatus().equals("PENDING")){
            return "Friend request already sent!";
        }

        FriendRequests friendRequests = new FriendRequests();
        friendRequests.setSender(sender);
        friendRequests.setRecipient(recipient);
        friendRequests.setStatus("PENDING");

        friendRequestsRepository.save(friendRequests);
        return "Friend request sent!";
    }

    @Override
    @Transactional
    public String acceptFriendRequest(Long requestId){
        FriendRequests friendRequest  = friendRequestsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendRequest.getStatus().equals("PENDING")){
            return "Friend request is not pending!";
        }

        User sender = friendRequest.getSender();
        User recepient = friendRequest.getRecipient();

        friendRequest.setStatus("ACCEPTED");

        this.addFriend(sender.getId(), recepient.getId());
        friendRequestsRepository.save(friendRequest);

        return "Friend request accepted!";
    }

    @Override
    @Transactional
    public String denyFriendRequest(Long requestId){
        FriendRequests friendRequest = friendRequestsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendRequest.getStatus().equals("PENDING")) {
            return "Friend request is not pending!";
        }

        friendRequest.setStatus("DENIED");
        friendRequestsRepository.save(friendRequest);
        return "Friend request denied.";
    }

    @Override
    public List<FriendRequests> getPendingRequestsForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return friendRequestsRepository.findByRecipientAndStatus(user, "PENDING");
    }

    @Override
    @Transactional
    public UserDTO convertUserToDTO(User user) {
        List<FriendsDTO> friends = user.getFriends().stream()
                .map(FriendsDTO::new)
                .collect(Collectors.toList());

        LocalDateTime lastSeenUser = user.getLastSeen();
        String lastSeen = lastSeenUser != null ? lastSeenUser.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null;

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getPass(),
                user.getEmail(),
                user.getDisplayedName(),
                user.getPfpUrl(),
                user.isOnline(),
                lastSeen,
                user.getRole(),
                friends
        );
    }

    @Override
    public User convertUserDTOToUser(UserDTO userDTO) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime lastSeenDateTime = LocalDateTime.parse(userDTO.getLastSeen(), formatter);

        List<User> friends = userDTO.getFriends().stream()
                .map(friendsDTO -> userRepository.findById(friendsDTO.getId())
                            .orElseThrow(() -> new RuntimeException("Friend not found")))
                .collect(Collectors.toList());

        return new User(
                userDTO.getId(),
                userDTO.getName(),
                userDTO.getPass(),
                userDTO.getEmail(),
                userDTO.getDisplayedName(),
                userDTO.getPfpUrl(),
                userDTO.isOnline(),
                lastSeenDateTime,
                userDTO.getRole(),
                friends
        );
    }
}
