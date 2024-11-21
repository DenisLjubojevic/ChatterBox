package hr.tvz.ljubojevic.chatterbox.DTO;

import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatInvitationDTO {
    private Long id;
    private User sender;
    private User recipient;
    private ChatRoom chat;
    private String status;
    private String createdDate;
}
