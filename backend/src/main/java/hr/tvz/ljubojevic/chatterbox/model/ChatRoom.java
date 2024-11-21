package hr.tvz.ljubojevic.chatterbox.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String description;
    private LocalDateTime createdDate;
    private LocalDateTime lastMessageTimestamp;

    @ManyToMany
    private List<User> members;

    @ManyToOne
    private User createdBy;

    private boolean isMuted;
    private boolean isPinned;

    private String pictureUrl;
}
