package hr.tvz.ljubojevic.chatterbox.repository;

import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.Message;
import hr.tvz.ljubojevic.chatterbox.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findById(Long id);

    List<Message> findByUser(User user);

    List<Message> findByChatRoom(ChatRoom chatRoom);

    Page<Message> findByChatRoomOrderByTimestampDesc(ChatRoom chatRoom, Pageable pageable);

    @Transactional
    @Modifying
    @Query("DELETE FROM Message msg where msg.chatRoom.id = ?1")
    void deleteMsg(Long id);
}
