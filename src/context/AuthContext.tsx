
// This file is kept for backward compatibility
// It re-exports the auth components from the new modular structure
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';
import type { Profile, AuthContextType } from './auth/types';

export { AuthProvider, useAuth };
export type { Profile, AuthContextType };
