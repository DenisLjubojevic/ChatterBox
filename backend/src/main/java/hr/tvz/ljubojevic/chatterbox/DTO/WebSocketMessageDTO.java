package hr.tvz.ljubojevic.chatterbox.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WebSocketMessageDTO {
    private String type;
    private WebSocketMessageData data;

    @Data
    @AllArgsConstructor
    public static class WebSocketMessageData {
        private Long chatRoomId;
        private String senderUsername;
        private String messageContent;
        private String timestamp;
    }
}
