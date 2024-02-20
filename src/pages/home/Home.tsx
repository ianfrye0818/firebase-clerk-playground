//library imports
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//component imports
//custom imports
import {
  getAllDownloadUrlsFromUserFolder,
  uploadImage,
  deleteImage,
} from '../../firebase/firebaseStorage';
//hook imports
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
//type imoprts
import { imageData } from '../../types/index';

export default function Home() {
  const [image, setImage] = useState<File[] | null>(null);
  const [imageUrls, setImageUrls] = useState<imageData[]>([]);
  const { user } = useUser();
  async function handleDelete(path: string) {
    await deleteImage(path);
    const urls = await getAllDownloadUrlsFromUserFolder(user?.id as string);
    if (urls instanceof Object) setImageUrls(urls);
  }

  //TODO: Refactor
  async function uploadFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!image || image.length === 0) return;
    console.log(user);
    if (!user) return;
    await uploadImage(image, user.id);
    const urls = await getAllDownloadUrlsFromUserFolder(user.id);
    if (urls instanceof Object) {
      setImageUrls(urls);
      setImage(null);
    }
  }

  useEffect(() => {
    if (user) {
      getAllDownloadUrlsFromUserFolder(user.id).then((urls) => {
        if (urls instanceof Object) setImageUrls(urls);
      });
    } else {
      setImageUrls([]); // Reset imageUrls to an empty array when user is null (logged out)
    }
  }, [user]);

  return (
    <div>
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
                <SignInButton />
              </li>
            </SignedOut>
          </ul>
        </nav>
      </header>
      <main className='flex flex-col gap-3 items-center'>
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
        {imageUrls.map((url) => (
          <div key={url.url}>
            <img
              src={url.url}
              alt='uploaded'
              width='700'
            />
            <button onClick={() => handleDelete(url.metadata.fullPath)}>Delete</button>
          </div>
        ))}
      </main>
    </div>
  );
}
