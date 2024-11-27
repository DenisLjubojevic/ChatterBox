package hr.tvz.ljubojevic.chatterbox.repository;

import hr.tvz.ljubojevic.chatterbox.model.ChatInvitation;
import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface ChatInviteRepository extends JpaRepository<ChatInvitation, Long> {
    List<ChatInvitation> findByRecipientAndStatus(User recipient, String status);

    Optional<ChatInvitation> findBySenderAndRecipientAndChat(User sender, User recipient, ChatRoom chat);

    List<ChatInvitation> findBySenderOrRecipient(User sender, User recipient);
}
