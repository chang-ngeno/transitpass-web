package ke.co.masajr.transport.controller;

import jakarta.validation.Valid;
import ke.co.masajr.transport.config.JwtUtil;
import ke.co.masajr.transport.dto.LoginRequest;
import ke.co.masajr.transport.dto.LoginResponse;
import ke.co.masajr.transport.entity.AppUser;
import ke.co.masajr.transport.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AppUserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        AppUser user = userRepository.findByUsername(request.username()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getTenantId());
        return ResponseEntity.ok(new LoginResponse(token, user.getRole().name(), user.getTenantId()));
    }
}
