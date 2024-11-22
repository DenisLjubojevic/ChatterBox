package hr.tvz.ljubojevic.chatterbox.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private boolean showOnlineStatus = true;

    @Column(nullable = false)
    private boolean profileVisibility = true;

    @Column(nullable = false)
    private String themeColor = "green";

    @Column(nullable = false)
    private String language = "en";
}
