package hr.tvz.ljubojevic.chatterbox.DTO;

import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private Long id;
    private String content;
    private String timestamp;
    private User user;
    private ChatRoom chatRoom;
}
