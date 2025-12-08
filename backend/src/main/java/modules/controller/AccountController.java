package modules.controller;

import jakarta.validation.Valid;
import modules.dto.request.*;
import modules.dto.response.ErrorResponse;
import modules.entity.Account;
import modules.entity.User;
import modules.service.AccountService;
import modules.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "${FRONTEND_URL}")
public class AccountController {
    private final AccountService accountService;
    private final UserService userService;

    public AccountController(AccountService accountService, UserService userService) {
        this.accountService = accountService;
        this.userService = userService;
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createAccount(@RequestBody AccountUserRequest request) {
        try {
            User user = userService.createUserWithAddresses(request.getUser());
            Account account = accountService.createAccountByAdmin(request.getAccount(), user.getId());
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("error", HttpStatus.BAD_REQUEST.value()));
        }
    }

    @PutMapping("/admin/{accountId}")
    public ResponseEntity<?> updateAccount(@PathVariable String accountId, @RequestBody AccountUserRequest request) {
        try {
            User user = userService.updateUserWithAddresses(request.getAccount().getUserId(), request.getUser());
            Account account = accountService.updateAccountByAdmin(accountId, request.getAccount(), user.getId());
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("error", HttpStatus.BAD_REQUEST.value()));
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody CreateUserRequest request) {
        try {
            return ResponseEntity.ok(accountService.createAccount(request));
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@RequestParam String email, @RequestParam String code) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(accountService.verifyCode(email, code));
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(accountService.login(request));
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            return ResponseEntity.ok(accountService.forgotPassword(request));
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            return ResponseEntity.ok(accountService.resetPassword(request));
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Account> findAll() {
        return accountService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == principal.userId")
    public Account findById(@PathVariable String id) {
        return accountService.findById(id);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

}