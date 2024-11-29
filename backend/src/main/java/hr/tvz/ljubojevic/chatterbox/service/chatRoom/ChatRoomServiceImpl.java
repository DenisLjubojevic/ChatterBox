package hr.tvz.ljubojevic.chatterbox.service.chatRoom;

import hr.tvz.ljubojevic.chatterbox.DTO.ChatRoomDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.UserDTO;
import hr.tvz.ljubojevic.chatterbox.model.ChatInvitation;
import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.ChatInviteRepository;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.ChatRoomRepository;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.MessageRepository;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.UserRepository;
import hr.tvz.ljubojevic.chatterbox.service.FileStorageService;
import hr.tvz.ljubojevic.chatterbox.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {
    @Autowired
    private UserService userService;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChatInviteRepository chatInviteRepository;

    @Value("${image.baseUrl}")
    private String imageBaseUrl;

    @Override
    public List<ChatRoomDTO> getChatRoomByMemberId(Long userId){
        List<ChatRoom> chatRooms = this.chatRoomRepository.findChatRoomsByMemberId(userId);
        return chatRooms.stream()
                .map(this::convertChatRoomToChatRoomDTO)
                .toList();
    }

    @Override
    public ChatRoomDTO createChatRoom(ChatRoomDTO chatRoomDTO, String username) {
        ChatRoom chatRoom = new ChatRoom();

        Optional<UserDTO> user = userService.findByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }

        List<User> members = new ArrayList<>();

        members.add(userService.convertUserDTOToUser(user.get()));

        chatRoom.setName(chatRoomDTO.getName());
        chatRoom.setType(chatRoomDTO.getType());
        chatRoom.setDescription(chatRoomDTO.getDescription());
        chatRoom.setCreatedDate(LocalDateTime.now());
        chatRoom.setLastMessageTimestamp(LocalDateTime.now());
        chatRoom.setMembers(members);

        chatRoom.setCreatedBy(userService.convertUserDTOToUser(user.get()));

        chatRoom.setMuted(false);
        chatRoom.setPinned(false);

        if (chatRoomDTO.getPictureUrl().equals("default")) {
            chatRoom.setPictureUrl(imageBaseUrl + "groupDefault.png");
        }else{
            chatRoom.setPictureUrl(chatRoomDTO.getPictureUrl());
        }

        chatRoomRepository.save(chatRoom);

        return convertChatRoomToChatRoomDTO(chatRoom);
    }

    @Override
    public ChatRoomDTO createClosedChatRoom(String senderUsername, String recipientUsername) {
        ChatRoom chatRoom = new ChatRoom();

        Optional<UserDTO> senderDTO = userService.findByUsername(senderUsername);
        if (senderDTO.isEmpty()) {
            throw new UsernameNotFoundException(senderUsername);
        }
        Optional<UserDTO> recipientDTO = userService.findByUsername(recipientUsername);
        if (recipientDTO.isEmpty()) {
            throw new UsernameNotFoundException(recipientUsername);
        }

        User sender = userService.convertUserDTOToUser(senderDTO.get());
        User recipient = userService.convertUserDTOToUser(recipientDTO.get());

        chatRoom.setName(senderUsername + "-" + recipientUsername);
        chatRoom.setDescription("Friend chat");
        chatRoom.setType("closed");
        chatRoom.setMembers(List.of(sender, recipient));
        chatRoom.setCreatedDate(LocalDateTime.now());
        chatRoom.setLastMessageTimestamp(LocalDateTime.now());
        chatRoom.setPinned(false);
        chatRoom.setMuted(false);
        chatRoom.setCreatedBy(sender);
        chatRoom.setPictureUrl(imageBaseUrl + "groupDefault.png");

        chatRoom = chatRoomRepository.save(chatRoom);
        return convertChatRoomToChatRoomDTO(chatRoom);
    }

    @Override
    @Transactional
    public List<UserDTO> getMembersOfChat(Long chatRoomId){
        Optional<ChatRoom> chatRoomsById = this.chatRoomRepository.findChatRoomById(chatRoomId);
        if (chatRoomsById.isPresent()) {
            List<User> members = chatRoomsById.get().getMembers();
            List<UserDTO> userDTOs = new ArrayList<>();
            members.stream()
                    .map(member -> userService.convertUserToDTO(member))
                    .forEach(userDTOs::add);
            return userDTOs;
        }else{
            return new ArrayList<>();
        }
    }

    @Override
    public Optional<ChatRoom> findClosedChatRoomBetweenUsers(String username1, String username2){
        return chatRoomRepository.FindClosedChatRoomBetweenFriends(username1, username2);
    }

    @Override
    public ChatRoomDTO updateChatRoom(ChatRoomDTO chatRoomDTO) {
        this.chatRoomRepository.save(convertChatRoomDTOToChatRoom(chatRoomDTO));
        return chatRoomDTO;
    }

    @Override
    public String uploadChatRoomPicture(Long chatRoomID, MultipartFile file) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomID).orElseThrow(() -> new RuntimeException("Chat room not found"));

        String oldUrl = chatRoom.getPictureUrl();
        String defaultPicture = imageBaseUrl + "groupDefault.png";

        if (oldUrl != null && !oldUrl.equals(defaultPicture)) {
            fileStorageService.deleteFile(oldUrl);
        }

        String fileUrl = fileStorageService.storeFile(file);
        chatRoom.setPictureUrl(fileUrl);
        chatRoomRepository.save(chatRoom);

        return fileUrl;
    }

    @Override
    public String storeNewPicture(MultipartFile file) {
        return fileStorageService.storeFile(file);
    }


    @Override
    public Optional<ChatRoomDTO> findChatRoomById(Long id) {
        return chatRoomRepository.findById(id).stream()
                .map(this::convertChatRoomToChatRoomDTO)
                .findFirst();
    }

    @Override
    public Optional<ChatRoomDTO> findChatRoomByName(String name) {
        return chatRoomRepository.findChatRoomByName(name).stream()
                .map(this::convertChatRoomToChatRoomDTO)
                .findFirst();
    }

    @Override
    public List<ChatRoomDTO> findAllChatRooms() {
        return chatRoomRepository.findAll().stream()
                .map(this::convertChatRoomToChatRoomDTO)
                .toList();
    }

    @Override
    public List<ChatRoom> searchPublicChatRoomsByName(String name) {
        return chatRoomRepository.findTop5PublicChatRoomByName(name);
    }

    @Override
    public String joinChatRoom(Long chatId, Long userId) {
        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(chatId);
        if (optionalChatRoom.isEmpty()) {
            return "Chat room not found";
        }
        ChatRoom chatRoom = optionalChatRoom.get();

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return "User not found";
        }
        User user = optionalUser.get();

        if (chatRoom.getMembers().contains(user)) {
            return "You are already a member of this chat room";
        }

        chatRoom.getMembers().add(user);
        chatRoomRepository.save(chatRoom);

        return "You have successfully joined the chat room";
    }

    @Override
    public String leaveChatRoom(Long chatId, Long userId){
        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(chatId);
        if (optionalChatRoom.isEmpty()) {
            return "Chat room not found";
        }
        ChatRoom chatRoom = optionalChatRoom.get();

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return "User not found";
        }
        User user = optionalUser.get();

        if (chatRoom.getMembers().contains(user)) {
            chatRoom.getMembers().remove(user);
            chatRoomRepository.save(chatRoom);
            return "You have left this chat room";
        }

        return "You are not member of this chat room";
    }

    @Override
    public void deleteChatRoomById(Long id) {
        Optional<ChatRoomDTO> chatRoomDTO =  this.findChatRoomById(id);
        if (chatRoomDTO.isPresent()) {
            this.messageRepository.deleteMsg(id);

            if (!Objects.equals(chatRoomDTO.get().getPictureUrl(), imageBaseUrl + "groupDefault.png")) {
                fileStorageService.deleteFile(chatRoomDTO.get().getPictureUrl());
            }

            chatRoomRepository.deleteById(id);
        }
    }

    @Override
    @Transactional
    public String sendChatInvitation(Long senderId, Long recipientId, Long chatId){
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        ChatRoom chat = chatRoomRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        Optional<ChatInvitation> existingChatInvitation = chatInviteRepository.findBySenderAndRecipientAndChat(sender, recipient, chat);
        System.out.println("Chat " + existingChatInvitation);

        if (existingChatInvitation.isPresent() && existingChatInvitation.get().getStatus().equals("PENDING")) {
            return "Chat invite has already been sent!";
        }

        ChatInvitation invitation = new ChatInvitation();
        invitation.setSender(sender);
        invitation.setRecipient(recipient);
        invitation.setChat(chat);
        invitation.setStatus("PENDING");

        chatInviteRepository.save(invitation);
        return "Chat invite sent successfully!";
    }

    @Override
    @Transactional
    public String acceptInvite(Long inviteId){
        ChatInvitation chatInvitation = chatInviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Chat invite not found"));

        if (!chatInvitation.getStatus().equals("PENDING")){
            return "Chat invite has already been resolved!";
        }

        User recipient = chatInvitation.getRecipient();
        ChatRoom chat = chatInvitation.getChat();
        chatInvitation.setStatus("ACCEPTED");

        this.joinChatRoom(chat.getId(), recipient.getId());
        chatInviteRepository.delete(chatInvitation);

        return "Chat invite accepted";
    }

    @Override
    @Transactional
    public String denyInvite(Long inviteId){
        ChatInvitation chatInvitation = chatInviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Chat invite not found"));

        if (!chatInvitation.getStatus().equals("PENDING")){
            return "Chat invite has already been resolved!";
        }

        chatInvitation.setStatus("DENIED");
        chatInviteRepository.delete(chatInvitation);
        return "Chat invite denied";
    }

    @Override
    public List<ChatInvitation> getPendingInvitation(Long recipientId){
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        return chatInviteRepository.findByRecipientAndStatus(recipient, "PENDING");
    }

    @Override
    @Transactional
    public ChatRoomDTO convertChatRoomToChatRoomDTO(ChatRoom chatRoom) {
        LocalDateTime createdDate = chatRoom.getCreatedDate();
        LocalDateTime lastMessageTimestamp = chatRoom.getLastMessageTimestamp();
        String createdDateString = createdDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String lastMessageTimestampString = lastMessageTimestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        UserDTO createdUserDTO = userService.convertUserToDTO(chatRoom.getCreatedBy());

        return new ChatRoomDTO(
                chatRoom.getId(),
                chatRoom.getName(),
                chatRoom.getType(),
                chatRoom.getDescription(),
                createdDateString,
                lastMessageTimestampString,
                chatRoom.getMembers().stream().map(user -> userService.convertUserToDTO(user)).toList(),
                createdUserDTO,
                chatRoom.isMuted(),
                chatRoom.isPinned(),
                chatRoom.getPictureUrl()
        );
    }

    @Override
    public ChatRoom convertChatRoomDTOToChatRoom(ChatRoomDTO chatRoomDTO) {
        List<User> membersList = chatRoomDTO.getMembers().stream().map(userDTO -> userService.convertUserDTOToUser(userDTO)).toList();
        User createByUser = userService.convertUserDTOToUser(chatRoomDTO.getCreatedBy());

        String createdDateString = chatRoomDTO.getCreatedDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime createdDateLDT = LocalDateTime.parse(createdDateString, formatter);

        String lastMessageString = chatRoomDTO.getLastMessageTimestamp();
        LocalDateTime lastMessageLDT = LocalDateTime.parse(lastMessageString, formatter);

        return new ChatRoom(
                chatRoomDTO.getId(),
                chatRoomDTO.getName(),
                chatRoomDTO.getType(),
                chatRoomDTO.getDescription(),
                createdDateLDT,
                lastMessageLDT,
                membersList,
                createByUser,
                chatRoomDTO.isMuted(),
                chatRoomDTO.isPinned(),
                chatRoomDTO.getPictureUrl()
        );
    }
}
