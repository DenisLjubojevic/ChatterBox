package hr.tvz.ljubojevic.chatterbox.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomDTO {
    private Long id;
    private String name;
    private String type;
    private String description;
    private String createdDate;
    private String lastMessageTimestamp;
    private List<UserDTO> members;
    private UserDTO createdBy;
    private boolean isMuted;
    private boolean isPinned;
    private String pictureUrl;
}
