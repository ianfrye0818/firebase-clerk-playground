import { AuthContext } from '../context/FirebaseAuthContextProvider';
import { useContext } from 'react';

export function useUser() {
  const authContext = useContext(AuthContext);
  //check if user is signed in
  const isSignedIn = authContext.user !== null;
  const isLoaded = authContext.user !== undefined;
  const user = authContext.user;
  const isLoading = !isLoaded;
  return { isSignedIn, isLoaded, isLoading, user };
}
