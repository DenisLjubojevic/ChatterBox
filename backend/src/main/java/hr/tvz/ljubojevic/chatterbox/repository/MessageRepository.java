package hr.tvz.ljubojevic.chatterbox.repository;

import hr.tvz.ljubojevic.chatterbox.model.ChatRoom;
import hr.tvz.ljubojevic.chatterbox.model.Message;
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

    List<Message> findByChatRoom(ChatRoom chatRoom);

    @Transactional
    @Modifying
    @Query("DELETE FROM Message msg where msg.chatRoom.id = ?1")
    void deleteMsg(Long id);
}
