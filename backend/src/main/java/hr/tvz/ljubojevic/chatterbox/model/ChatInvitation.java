package hr.tvz.ljubojevic.chatterbox.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class ChatInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private ChatRoom chat;

    private String status;

    private LocalDateTime createdDate;

    public ChatInvitation() {
        this.createdDate = LocalDateTime.now();
    }
}
