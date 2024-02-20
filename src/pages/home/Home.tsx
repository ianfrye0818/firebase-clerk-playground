//library imports
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
//custom imports
import {
  getAllDownloadUrlsFromUserFolder,
  uploadImage,
  deleteImage,
} from '../../firebase/firebaseStorage';
//hook imports
// import { useUser } from '../../hooks/useUser'; //firebase only
//type imoprts
import { imageData } from '../../types/index';

export default function Home() {
  //state for storing image files for upload
  const [image, setImage] = useState<File[] | null>(null);
  const [progress, setProgress] = useState<number>(0);
  //state for storing image data
  const [imageMetaData, setImageMetaData] = useState<imageData[]>([]);
  //get the user from the useUser hook (clerk)
  const { user } = useUser(); //also available (isSignedIn, isLoading)
  //const{isSignedIn, isLoaded, isLoading, user} = useUser() //firebase only

  //handles the delete button to delete an image from the storage bucket
  async function handleDelete(path: string) {
    await deleteImage(path);
    const urls = await getAllDownloadUrlsFromUserFolder(user?.id as string);
    if (urls instanceof Object) setImageMetaData(urls);
  }

  //TODO: Refactor
  async function uploadFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //if there are no images - do not try to upload image
    if (!image || image.length === 0) return;

    //if there is no user signed in - do not try to upload an image to their storage bucket - if they do, you'll get a folder called "undefined"
    if (!user) return;

    //upload the image using the user.id as the /images/user.id/uuid + file.name
    await uploadImage(image, user.id, (progress) => setProgress(progress));
    //gets the metadata of the images in the user's folder
    const metadata = await getAllDownloadUrlsFromUserFolder(user.id);
    //if the metadata is an object, set the imageMetaData state to the metadata
    //right now i have it returning a message if the data is not found - probably could refactor so that you could
    //elimate this if statement
    if (metadata instanceof Object) {
      setImageMetaData(metadata);
      setImage(null);
      setProgress(0);
    }
  }

  //useeffect to load images from the users folder when the page first loads and if the user changes (signs in or out)
  useEffect(() => {
    //this if statement ensures that the user is loaded before getting images
    //if you do not have this, user will be null when page first loads and you will not get images
    if (user) {
      getAllDownloadUrlsFromUserFolder(user.id).then((urls) => {
        if (urls instanceof Object) setImageMetaData(urls);
      });
    } else {
      setImageMetaData([]); // Reset imageUrls to an empty array when user is null (logged out)
    }
  }, [user]);

  //this could be refactored to be more readable
  return (
    <div>
      {/* header with navbar and user button */}
      <header>
        <nav className='p-4 flex items-center'>
          {user && user.primaryEmailAddress && <span>{user.primaryEmailAddress.toString()}</span>}
          <ul className='flex justify-end mr-5 gap-4 items-center ml-auto'>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <SignedIn>
              <li>
                <UserButton />
              </li>
            </SignedIn>
            <SignedOut>
              <li>
                <Link to={'signin'}>Sign In</Link>
              </li>
            </SignedOut>
          </ul>
        </nav>
      </header>
      <main className='flex flex-col gap-3 items-center'>
        {/* form for submitting photos */}
        <form
          className='border border-gray-700 p-4 rounded-md w-full max-w-[700px] flex flex-col gap-3 items-center'
          onSubmit={(e) => uploadFile(e)}
        >
          <label htmlFor='image'></label>
          <input
            id='image'
            name='image'
            type='file'
            multiple={true}
            onChange={(e) => setImage(Array.from(e.target.files || []))}
          />
          <button
            className='p-3 rounded-md border min-w-[150px] my-4 border-gray-600'
            type='submit'
          >
            Upload
          </button>
        </form>
        {progress > 0 && (
          <progress
            value={progress}
            max='100'
          ></progress>
        )}
        {/* map over the imageMetaData and display the images */}
        {imageMetaData.map((data) => (
          <div
            className='flex gap-2 items-center'
            key={data.url}
          >
            <img
              src={data.url}
              alt='uploaded'
              width='700'
            />
            <button
              className='p-2 bg-red-500 hover:bg-red-600 text-white min-w-[100px]'
              onClick={() => handleDelete(data.metadata.fullPath)}
            >
              Delete
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
