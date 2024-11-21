package hr.tvz.ljubojevic.chatterbox.repository;

import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findChatRoomByName(String name);

    Optional<ChatRoom> findChatRoomById(Long id);

    @Query("SELECT c FROM ChatRoom c JOIN c.members m where m.id = :userId")
    List<ChatRoom> findChatRoomsByMemberId(@Param("userId") Long userId);

    @Query("SELECT c FROM ChatRoom c " +
            "WHERE c.name LIKE  %:name% AND c.type = 'Public'" +
            "ORDER BY c.createdDate DESC")
    List<ChatRoom> findTop5PublicChatRoomByName(@Param("name") String name);


    @Query("SELECT c FROM ChatRoom c JOIN c.members m1 JOIN c.members m2 " +
            "WHERE m1.username = :username1 AND m2.username = :username2 AND c.type = 'closed'")
    Optional<ChatRoom> FindClosedChatRoomBetweenFriends(@Param("username1") String username1,
                                                        @Param("username2") String username2);
}
