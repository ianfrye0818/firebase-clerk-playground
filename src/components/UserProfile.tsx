import { PropsWithChildren, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const SavedUsersProfile = ({ children }: PropsWithChildren) => {
  const { user } = useUser();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;
        const { primaryEmailAddress, firstName, lastName, imageUrl } = user;
        //check to see if document exists
        const docRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(docRef);
        //if document exists, update it
        const userDoc = {
          updatedAt: Timestamp.now(),
          email: primaryEmailAddress?.toString(),
          fullname: `${firstName} ${lastName}`,
          firstName,
          lastName,
          imageUrl,
        };
        if (docSnap.exists()) {
          await updateDoc(docRef, userDoc);
        }
        //if document does not exist, create it
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
