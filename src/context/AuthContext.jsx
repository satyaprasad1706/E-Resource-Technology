import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import { saveUserProfile, getUsers } from '../firebase/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const usersList = await getUsers();
        const found = usersList.find(u => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase());
        if (found) {
          setCurrentUser(found);
        } else {
          // Create a default student profile if not found
          const newProfile = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: "Student",
            department: "Computer Science",
            semester: "4th Semester",
            regNo: `2022CSE${Math.floor(1000 + Math.random() * 9000)}`
          };
          await saveUserProfile(user.uid, newProfile);
          setCurrentUser(newProfile);
        }
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (!auth) {
      return { success: false, message: "Firebase Auth not initialized." };
    }
    
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const usersList = await getUsers();
      const found = usersList.find(u => u.uid === userCred.user.uid || u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
      }
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) {
      return { success: false, message: "Firebase Auth not initialized." };
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      
      if (!email.toLowerCase().endsWith('@iare.ac.in')) {
        await signOut(auth);
        return { success: false, message: "Access Restricted: Only @iare.ac.in email accounts are permitted to sign in." };
      }

      const usersList = await getUsers();
      const found = usersList.find(u => u.uid === result.user.uid || u.email.toLowerCase() === email.toLowerCase());
      let profile;
      if (found) {
        profile = found;
      } else {
        profile = {
          uid: result.user.uid,
          name: result.user.displayName || email.split('@')[0],
          email: email,
          role: "Student",
          department: "Computer Science",
          semester: "4th Semester",
          regNo: `2022CSE${Math.floor(1000 + Math.random() * 9000)}`
        };
        await saveUserProfile(result.user.uid, profile);
      }
      
      setCurrentUser(profile);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    if (!auth) {
      return { success: false, message: "Firebase Auth not initialized." };
    }

    const { name, email, password, role, department, semester } = userData;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const newProfile = {
        uid: userCred.user.uid,
        name,
        email,
        role: role || "Student",
        department: department || "Computer Science",
        semester: semester || "4th Semester",
        regNo: role === 'Admin' ? 'ADM-99' : role === 'Professor' ? `PROF-${Math.floor(100 + Math.random() * 900)}` : `2022CSE${Math.floor(1000 + Math.random() * 9000)}`
      };
      await saveUserProfile(userCred.user.uid, newProfile);
      setCurrentUser(newProfile);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    const updated = { ...currentUser, ...profileData };
    
    // Save to database
    await saveUserProfile(currentUser.uid, updated);
    setCurrentUser(updated);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, loginWithGoogle, register, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export { AuthContext };
