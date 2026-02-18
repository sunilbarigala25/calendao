import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, CategoryColors } from '../models/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCategoryColors: (colors: CategoryColors) => void;
  updatePrimaryColor: (color: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const DEFAULT_COLORS: CategoryColors = {
  event: '#B3E5FC',
  note: '#F3E5F5',
  todo: '#C8E6C9',
  reminder: '#FFF9C4'
};

// DEMO MODE: Mock user for UI testing without Firebase
const DEMO_USER: User = {
  userId: 'demo-user-123',
  email: 'sunil@ahora.app',
  displayName: 'Sunil Barigala',
  photoURL: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=256&auto=format&fit=crop', // Nature DP
  theme: 'material',
  colorMode: 'light',
  primaryColor: '#6750A4', // Default Material Purple
  categoryColors: DEFAULT_COLORS,
  createdAt: new Date() as any,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Set demo user by default for UI testing
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [firebaseUser, setFirebaseUser] = useState<any | null>({ uid: 'demo-user-123' });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock login - just set demo user
    setUser(DEMO_USER);
    setFirebaseUser({ uid: 'demo-user-123' });
  };

  const signup = async (email: string, password: string) => {
    // Mock signup - just set demo user
    setUser(DEMO_USER);
    setFirebaseUser({ uid: 'demo-user-123' });
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
    setFirebaseUser(null);
  };

  const updateCategoryColors = (colors: CategoryColors) => {
    if (user) {
      setUser({ ...user, categoryColors: colors });
    }
  };

  const updatePrimaryColor = (color: string) => {
    if (user) {
      setUser({ ...user, primaryColor: color });
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, signup, logout, updateCategoryColors, updatePrimaryColor }}>
      {children}
    </AuthContext.Provider>
  );
};

/* 
 * TO ENABLE REAL FIREBASE AUTHENTICATION:
 * 
 * 1. Uncomment the code below and delete the mock implementation above
 * 2. Configure Firebase credentials in src/config/firebase.ts
 * 3. Remove the DEMO_USER constant
 * 
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLLECTION_USERS } from '../config/constants';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, COLLECTION_USERS, fbUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      const newUser: User = {
        userId: fbUser.uid,
        email: fbUser.email!,
        theme: 'material',
        colorMode: 'light',
        createdAt: new Date() as any,
      };
      
      await setDoc(doc(db, COLLECTION_USERS, fbUser.uid), newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
*/
