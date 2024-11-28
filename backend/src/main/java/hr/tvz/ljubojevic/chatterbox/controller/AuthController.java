package hr.tvz.ljubojevic.chatterbox.controller;

import hr.tvz.ljubojevic.chatterbox.DTO.AuthRequestDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.JwtResponseDTO;
import hr.tvz.ljubojevic.chatterbox.DTO.RefreshTokenDTO;
import hr.tvz.ljubojevic.chatterbox.model.RefreshToken;
import hr.tvz.ljubojevic.chatterbox.service.auth.JwtService;
import hr.tvz.ljubojevic.chatterbox.service.auth.RefreshTokenService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;

    @PostMapping("/api/login")
    public JwtResponseDTO authenticationAndGetToken(@RequestBody AuthRequestDTO authRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword()));
        System.out.println("login called");

        if (authentication.isAuthenticated()) {
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequestDTO.getUsername());
            return JwtResponseDTO.builder()
                    .accessToken(jwtService.generateToken(authRequestDTO.getUsername()))
                    .token(refreshToken.getToken())
                    .build();
        }else{
            throw new UsernameNotFoundException("Invalid user request..!!");
        }
    }

    @PostMapping("/api/refreshToken")
    public JwtResponseDTO refreshToken(@RequestBody RefreshTokenDTO refreshTokenDTO) {
        System.out.println("refreshToken called");
        return refreshTokenService.findByToken(refreshTokenDTO.getToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user.getUsername());
                    return JwtResponseDTO.builder()
                            .accessToken(accessToken)
                            .token(refreshTokenDTO.getToken())
                            .build();
                }).orElseThrow(() -> new RuntimeException("Refresh Token is not in DB..!!"));
    }

    @PostMapping("/api/logout")
    public void logout(@RequestBody RefreshTokenDTO refreshTokenDTO) {
        refreshTokenService.deleteByToken(refreshTokenDTO.getToken());

        System.out.println("Logout called and user status updated");
    }
}
