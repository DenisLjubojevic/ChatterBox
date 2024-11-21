package hr.tvz.ljubojevic.chatterbox.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomRequestDTO {
    private String name;
    private String description;
    private String type;
    private String pictureUrl;
}
