package hr.tvz.ljubojevic.chatterbox.service.auth;

import hr.tvz.ljubojevic.chatterbox.model.User;
import hr.tvz.ljubojevic.chatterbox.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }

        return org.springframework.security.core.userdetails.User.
                withUsername(user.get().getUsername())
                .password(user.get().getPassword())
                .roles(user.get().getRole())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
