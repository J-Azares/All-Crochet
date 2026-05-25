import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise<User>} - Firebase user object
 */
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential.user;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<User>} - Firebase user object
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

/**
 * Get current user
 * @returns {User | null} - Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates (displayName, photoURL)
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, updates);
    } else {
      throw new Error('No authenticated user');
    }
  } catch (error) {
    throw new Error(`Profile update failed: ${error.message}`);
  }
};