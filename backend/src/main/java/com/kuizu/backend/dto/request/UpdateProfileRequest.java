package com.kuizu.backend.dto.request;

import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String displayName;
    private String bio;

    @URL(message = "Invalid profile picture URL")
    private String profilePictureUrl;

    @Pattern(regexp = "^[a-z]{2}([-_][A-Z]{2})?$", message = "Invalid locale format (e.g., 'en' or 'en-US')")
    private String locale;

    @Pattern(regexp = "^[A-Za-z_]+(/[A-Za-z_\\-]+)*$", message = "Invalid timezone format (e.g., 'UTC' or 'Asia/Ho_Chi_Minh')")
    private String timezone;

    private String preferences;
}
