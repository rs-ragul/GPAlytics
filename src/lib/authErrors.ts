export function getAuthErrorMessage(error: unknown): string {
  let errorCode = "unknown";
  
  // Handle Firebase AuthError
  if (error && typeof error === "object" && "code" in error) {
    errorCode = String((error as any).code) || "unknown";
  }
  // Handle error string directly
  else if (typeof error === "string") {
    errorCode = error;
  }
  
  const errorMessages: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found with this email. Try registering instead.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already registered. Try logging in.",
    "auth/weak-password": "Password must be at least 6 characters long.",
    "auth/too-many-requests": "Too many failed login attempts. Try again later.",
    "auth/operation-not-allowed": "Email/password sign-in is not enabled.",
    "auth/invalid-credential": "Invalid email or password. Check and try again.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/missing-email": "Email is required.",
    "auth/missing-password": "Password is required.",
    "unknown": "An authentication error occurred. Please try again.",
  };

  return errorMessages[errorCode] || "An authentication error occurred. Please try again.";
}
