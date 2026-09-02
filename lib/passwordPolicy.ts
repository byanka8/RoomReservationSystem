export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 characters long and include uppercase, lowercase, and a special character.";

export function isPasswordComplexEnough(password: string): boolean {
  if (typeof password !== "string") return false;
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) return false;
  return true;
}

export function getPasswordPolicyError(password: string): string | null {
  return isPasswordComplexEnough(password) ? null : PASSWORD_POLICY_MESSAGE;
}
