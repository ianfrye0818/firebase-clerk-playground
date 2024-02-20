import { db } from './firebaseConfig';
import {
  addDoc,
  doc,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
  getDocs,
  where,
  query,
  DocumentData,
} from 'firebase/firestore';

//get item from db by id
export async function getItemById(id: string) {
  try {
    const docRef = doc(db, 'items', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('No document exists');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    return null;
  }
}

//get all documents from a colleciton
export async function getAllItemsFromCollection(collectionName: string) {
  try {
    //create a query string
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.error('No documents exist');
      return null;
    }
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error('Error getting documents:', error);
    return null;
  }
}

//query collection for documents that match a specific field
export async function queryDBForDocument(collectionName: string, field: string, value: string) {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    //return documents
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as DocumentData));
  } catch (error) {
    console.log(error);
    return null;
  }
}

//add document to database
export async function addItemToCollection(collectionName: string, data: DocumentData) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    return null;
  }
}

//update a document in a collection
export async function updateItemInCollection(
  collectionName: string,
  id: string,
  data: DocumentData
) {
  try {
    await updateDoc(doc(db, collectionName, id), data);
    return { message: 'Document updated successfully' };
  } catch (error) {
    console.error('Error updating document:', error);
    return null;
  }
}

//delete document from database
export async function deleteItemFromCollection(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { message: 'Document deleted successfully' };
  } catch (error) {
    console.error('Error removing document:', error);
    return false;
  }
}

//delete collection from database
export async function deleteCollection(collectionName: string) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    return { message: 'Collection deleted successfully' };
  } catch (error) {
    console.error('Error removing collection:', error);
    return false;
  }
}
