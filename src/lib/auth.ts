/**
 * Local Authentication Utilities
 * 
 * Uses localStorage for user management and session storage
 * Supports user registration, login, and session persistence
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export const auth = {
  // Register new user
  signUp: (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      try {
        console.log('Signup attempt:', { fullName, email, password: '***' });
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          resolve({ success: false, error: 'Invalid email format' });
          return;
        }

        // Validate password length
        if (password.length < 8) {
          resolve({ success: false, error: 'Password must be at least 8 characters' });
          return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('umarket_users') || '[]');
        console.log('Existing users:', users);

        // Check for duplicate email (case-insensitive)
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = users.find((u: User) => u.email.toLowerCase() === normalizedEmail);
        if (existingUser) {
          resolve({ success: false, error: 'Email already registered' });
          return;
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          fullName: fullName.trim(),
          email: normalizedEmail, // Store lowercase
          password: password, // Store as-is (no hashing for localStorage demo)
          createdAt: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        localStorage.setItem('umarket_users', JSON.stringify(users));
        console.log('User saved successfully:', newUser);

        // Auto-login after registration
        const currentUser: CurrentUser = {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          createdAt: newUser.createdAt
        };
        localStorage.setItem('umarket_current_user', JSON.stringify(currentUser));

        resolve({ success: true });
      } catch (error) {
        console.error('Signup error:', error);
        resolve({ success: false, error: 'Registration failed' });
      }
    });
  },

  // Sign in user
  signIn: (email: string, password: string): Promise<CurrentUser | null> => {
    return new Promise((resolve) => {
      try {
        console.log('Login attempt:', { email, password: '***' });
        
        // Get users
        const users = JSON.parse(localStorage.getItem('umarket_users') || '[]');
        console.log('Stored Users:', users);

        // Find user (case-insensitive email, trim whitespace)
        const normalizedEmail = email.trim().toLowerCase();
        const user = users.find(
          (u: User) => u.email.toLowerCase() === normalizedEmail && u.password === password
        );

        console.log('User found:', user ? 'YES' : 'NO');

        if (user) {
          const currentUser: CurrentUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt
          };
          localStorage.setItem('umarket_current_user', JSON.stringify(currentUser));
          console.log('Login successful, user stored:', currentUser);
          resolve(currentUser);
        } else {
          console.log('Login failed: Invalid credentials');
          resolve(null);
        }
      } catch (error) {
        console.error('Login error:', error);
        resolve(null);
      }
    });
  },

  // Sign out user
  signOut: (): void => {
    localStorage.removeItem('umarket_current_user');
  },

  // Get current user
  getCurrentUser: (): CurrentUser | null => {
    try {
      const userStr = localStorage.getItem('umarket_current_user');
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
