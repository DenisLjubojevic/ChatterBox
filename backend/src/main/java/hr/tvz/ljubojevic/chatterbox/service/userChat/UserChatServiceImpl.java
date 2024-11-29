package hr.tvz.ljubojevic.chatterbox.service.userChat;

import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.ChatRoomRepository;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.MessageRepository;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.UserRepository;
import hr.tvz.ljubojevic.chatterbox.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
public class UserChatServiceImpl implements UserChatService {
    private final UserRepository userRepository;
    public final ChatRoomRepository chatRoomRepository;
    public final MessageRepository messageRepository;
    public final FileStorageService fileStorageService;

    @Value("${image.baseUrl}")
    private String imageBaseUrl;

    public UserChatServiceImpl(UserRepository userRepository,
                               ChatRoomRepository chatRoomRepository,
                               MessageRepository messageRepository,
                               FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public User removeFriendAndDeleteChat(User user, User friend){

        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.FindClosedChatRoomBetweenFriends(user.getUsername(), friend.getUsername());

        chatRoomOpt.ifPresent(chatRoom -> {
            Optional<ChatRoom> chatRoomOptional =  chatRoomRepository.findById(chatRoom.getId()).stream()
                    .findFirst();
            if (chatRoomOptional.isPresent()) {
                this.messageRepository.deleteMsg(chatRoom.getId());

                if (!Objects.equals(chatRoomOptional.get().getPictureUrl(), imageBaseUrl + "groupDefault.png")) {
                    fileStorageService.deleteFile(chatRoomOptional.get().getPictureUrl());
                }

                chatRoomRepository.deleteById(chatRoom.getId());
            }
        });



        user.getFriends().remove(friend);
        friend.getFriends().remove(user);

        userRepository.save(user);
        userRepository.save(friend);

        return user;
    }
}
