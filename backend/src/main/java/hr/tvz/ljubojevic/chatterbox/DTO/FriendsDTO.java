package hr.tvz.ljubojevic.chatterbox.DTO;

import hr.tvz.ljubojevic.chatterbox.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendsDTO {
    private Long id;
    private String username;
    private String displayName;

    public FriendsDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayedName();
    }
}
