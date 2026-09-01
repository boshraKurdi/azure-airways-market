// Validation utilities for authentication forms

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function validateName(name: string): string | undefined {
  if (!name || name.trim().length === 0) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (name.length > 100) {
    return "Name must not exceed 100 characters";
  }
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email || email.trim().length === 0) {
    return "Email is required";
  }
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password || password.length === 0) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (password.length > 100) {
    return "Password must not exceed 100 characters";
  }
  return undefined;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateLoginForm(
  email: string,
  password: string,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }

  return errors;
}
