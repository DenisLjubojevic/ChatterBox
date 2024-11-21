package hr.tvz.ljubojevic.chatterbox.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class FriendRequests {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recepient_id", nullable = false)
    private User recipient;

    private String status;

    private LocalDateTime createdDate;

    public FriendRequests() {
        this.createdDate = LocalDateTime.now();
    }
}
