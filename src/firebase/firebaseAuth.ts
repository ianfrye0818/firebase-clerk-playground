//library imports
import { auth } from './firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
} from 'firebase/auth';

//custom imports

//sign in user
export async function signInUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//create user
export async function createUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//update user
export async function updateUser(data: object) {
  const user = auth.currentUser;
  try {
    if (!user) return 'User not found! Please sign in again.';
    await updateProfile(user, data);
    return 'User updated successfully!';
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//delete user
export async function deleteuserAccount() {
  const user = auth.currentUser;
  try {
    if (!user) return 'User not found! Please sign in again.';
    await deleteUser(user);
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//send password reset email
export async function resetUserPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'Email sent successfully!';
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}
//update password
export async function updateUserPassword(password: string) {
  const user = auth.currentUser;
  try {
    if (!user) return 'User not found! Please sign in again.';
    await updatePassword(user, password);
    return 'Password updated successfully!';
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//update users email address
export async function updateUserEmail(email: string) {
  const user = auth.currentUser;
  try {
    if (!user) return 'User not found! Please sign in again.';
    await updateEmail(user, email);
    return 'Email updated successfully!';
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//sign out user
export async function signOutUser() {
  try {
    await signOut(auth);
    return 'User signed out successfully!';
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}
