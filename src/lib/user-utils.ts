/**
 * Generates user initials from a name or email
 * @param name The user's full name or email address
 * @returns The user's initials (1-2 characters)
 */
export function getUserInitials(name?: string | null): string {
  if (!name) return 'U';
  
  // If it's an email, get the part before @
  const namePart = name.includes('@') ? name.split('@')[0] : name;
  
  // Split by spaces or dots and filter out empty strings
  const parts = namePart.split(/[\s.]+/).filter(Boolean);
  
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Return first and last initial
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * Formats a user's display name from their profile
 * @param user The user object from auth
 * @returns A formatted display name
 */
export function formatDisplayName(user: {
  displayName?: string | null;
  email?: string | null;
}): string {
  if (user.displayName) return user.displayName;
  if (user.email) return user.email.split('@')[0];
  return 'User';
}

/**
 * Formats a user's role for display
 * @param role The user's role
 * @returns A formatted role string
 */
export function formatUserRole(role?: string): string {
  if (!role) return 'User';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
