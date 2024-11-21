package hr.tvz.ljubojevic.chatterbox.repository;

import hr.tvz.ljubojevic.chatterbox.model.FriendRequests;
import hr.tvz.ljubojevic.chatterbox.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestsRepository extends JpaRepository<FriendRequests, Long> {
    List<FriendRequests> findByRecipientAndStatus(User recipient, String status);

    Optional<FriendRequests> findBySenderAndRecipient(User sender, User recipient);
}