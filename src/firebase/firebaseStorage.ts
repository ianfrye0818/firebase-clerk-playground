//library imports
import {
  ref,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

//custom imports
import { storage } from './firebaseConfig';

//upload image to storage bucket
// export const uploadImage = async (files: File[], id: string) => {
//   try {
//     const urls = await Promise.all(
//       files.map(async (file) => {
//         const storageRef = ref(storage, `images/${id}/${uuidv4()}${file.name}`);
//         await uploadBytes(storageRef, file);
//         const url = await getDownloadURL(storageRef);
//         return url;
//       })
//     );
//     return urls;
//   } catch (error) {
//     console.error(error);
//     return 'Something went wrong! Please try again.';
//   }
// };

export const uploadImage = async (
  files: File[],
  id: string,
  setUploadProgress: (progress: number) => void
) => {
  try {
    const urls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `images/${id}/${uuidv4()}${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Set up progress listener
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
          },
          (error: Error) => {
            console.error(error);
          }
        );

        await uploadTask;

        // const url = await getDownloadURL(storageRef);
        // const metadata = await getMetadata(storageRef);
        const alldata = await getAllDownloadUrlsFromUserFolder(id);
        if (alldata !== null) {
          return alldata;
        } else {
          return [];
        }
      })
    );
    return urls.flat();
  } catch (error) {
    console.error(error);
    return null;
  }
};

//get download url from storage bucket
export async function getDownloadUrl(path: string) {
  try {
    const imageRef = ref(storage, path);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//getdownload urls and metadata from storage bucket (sorted by date modified)
export async function getAllDownloadUrlsFromUserFolder(id: string) {
  try {
    const listRef = ref(storage, `images/${id}`);
    const listResult = await listAll(listRef);

    // Fetching URLs and metadata in parallel
    const urlAndMetadataList = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        return { url, metadata };
      })
    );

    // Sort by date modified
    const sortedUrlList = urlAndMetadataList.sort((a, b) => {
      // Parse date modified from metadata
      const dateA = new Date(a.metadata.updated);
      const dateB = new Date(b.metadata.updated);
      // Compare dates
      return dateB.getTime() - dateA.getTime(); // descending order
    });

    return sortedUrlList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//delete image from storage
export async function deleteImage(path: string) {
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
    const allimages = await getAllDownloadUrlsFromUserFolder(path);
    if (allimages !== null) {
      return allimages;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

//delete all images from storage
export async function deleteAllImages(id: string) {
  try {
    const listRef = ref(storage, `images/${id}`);
    const listResult = await listAll(listRef);
    await Promise.all(listResult.items.map((itemRef) => deleteObject(itemRef)));
    return 'All images deleted successfully!';
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}

//delete user folder from storage
export async function deleteUserFolder(id: string) {
  try {
    const folderRef = ref(storage, `images/${id}`);
    await deleteObject(folderRef);
    return 'User folder deleted successfully!';
  } catch (error) {
    console.error(error);
    return 'Something went wrong! Please try again.';
  }
}
