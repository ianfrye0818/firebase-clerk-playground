//library imports
import { useState, createContext, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';

//custom imports
import { auth } from '../firebase/firebaseConfig';

//create the context
export const AuthContext = createContext<{ user: User | null }>({ user: null });

type AuthContextProviderProps = {
  children: React.ReactNode;
};
//create the provider
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // subscibe to auth state changes from firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
