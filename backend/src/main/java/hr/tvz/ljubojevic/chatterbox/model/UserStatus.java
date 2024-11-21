package hr.tvz.ljubojevic.chatterbox.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatus {
    private String userId;
    private String status;
}
