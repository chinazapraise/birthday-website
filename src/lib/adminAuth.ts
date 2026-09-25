const DEFAULT_PASSWORD = "tomide27";

function expectedPassword(): string {
  const v = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  return v && v.length > 0 ? v : DEFAULT_PASSWORD;
}

export function isValidAdminPassword(password: string): boolean {
  const expected = expectedPassword();
  if (password.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
