package hr.tvz.ljubojevic.chatterbox.service.userChat;

import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.repository.jpa.UserRepository;
import hr.tvz.ljubojevic.chatterbox.service.chatRoom.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserChatServiceImpl implements UserChatService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRoomService chatRoomService;

    @Override
    @Transactional
    public User removeFriendAndDeleteChat(User user, User friend){

        Optional<ChatRoom> chatRoomOpt = chatRoomService.findClosedChatRoomBetweenUsers(user.getUsername(), friend.getUsername());
        chatRoomOpt.ifPresent(chatRoom -> chatRoomService.deleteChatRoomById(chatRoom.getId()));

        user.getFriends().remove(friend);
        friend.getFriends().remove(user);

        userRepository.save(user);
        userRepository.save(friend);

        return user;
    }
}
