package hr.tvz.ljubojevic.chatterbox.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequestDTO {
    private Long chatRoomId;
    private String senderUsername;
    private String messageContent;
    private String timestamp;
}
