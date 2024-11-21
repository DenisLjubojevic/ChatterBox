package hr.tvz.ljubojevic.chatterbox.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String pass;
    private String email;
    private String displayedName;
    private String pfpUrl;
    private boolean isOnline;
    private String lastSeen;
    private String role;
    private List<FriendsDTO> friends;
}
