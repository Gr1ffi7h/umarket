/**
 * Local Authentication Utilities
 * 
 * Temporary local authentication until database is ready
 * Uses localStorage for user session management
 */

export interface User {
  id: string;
  email: string;
  name: string;
}

export const auth = {
  // Sign in user
  signIn: (email: string, password: string): Promise<User | null> => {
    // Simple mock authentication for now
    if (email === 'user@umarket.edu' && password === 'password') {
      const user: User = {
        id: '1',
        email: 'user@umarket.edu',
        name: 'Demo User'
      };
      localStorage.setItem('umarket_user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  // Sign out user
  signOut: (): void => {
    localStorage.removeItem('umarket_user');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('umarket_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user;
      }
      return null;
    } catch {
        return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const user = auth.getCurrentUser();
    return user !== null;
  }
};
