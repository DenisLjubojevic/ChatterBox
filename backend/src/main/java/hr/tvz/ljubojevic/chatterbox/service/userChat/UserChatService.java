package hr.tvz.ljubojevic.chatterbox.service.userChat;

import hr.tvz.ljubojevic.chatterbox.model.User;

public interface UserChatService {
    User removeFriendAndDeleteChat(User user, User friend);
}
