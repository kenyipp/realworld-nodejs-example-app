export enum ErrorCodes {
	// General Error Codes
	InsufficientPermissions = "general_insufficient_permissions",
	UnprocessableContent = "general_unprocessable_content",
	NotFound = "general_not_found",
	// Auth Error Codes
	MissingAuthorizationToken = "auth_missing_authorization_token",
	InvalidAuthenticationScheme = "auth_invalid_authentication_scheme",
	ExpiredToken = "auth_expired_token",
	InvalidAuthUser = "auth_invalid_user"
	// User Error Codes
}
