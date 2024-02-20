//library imports
import { PropsWithChildren, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
//custom imports
import { db } from '../firebase/firebaseConfig';

//custom wrapper for saving a user to firestore when they signin from clerk - could also be modified to work with firebase
// could add additional fields to the user document
// could also add a loading state
//will also update user if they change their profile
const SavedUsersProfile = ({ children }: PropsWithChildren) => {
  //get user from clerk
  const { user } = useUser();
  //will update db anytime user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // if there is no user - no reason to update their info
        if (!user) return;
        //get fields you want to save from user object
        const { primaryEmailAddress, firstName, lastName, imageUrl } = user;
        //check to see if document exists
        const docRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(docRef);
        //create a user document to save to firestore
        const userDoc = {
          updatedAt: Timestamp.now(),
          email: primaryEmailAddress?.toString(),
          fullname: `${firstName} ${lastName}`,
          firstName,
          lastName,
          imageUrl,
        };
        //if document exists, update it
        if (docSnap.exists()) {
          await updateDoc(docRef, userDoc);
        }
        //if document does not exist, create it
        //spread in userdoc and then add a createdAt field
        await setDoc(doc(db, 'users', user.id), {
          ...userDoc,
          createdAt: Timestamp.now(),
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  return <div>{children}</div>;
};

export default SavedUsersProfile;
