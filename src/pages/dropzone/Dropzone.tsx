import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  deleteImage,
  getAllDownloadUrlsFromUserFolder,
  uploadImage,
} from '../../firebase/firebaseStorage';
import { FullMetadata } from 'firebase/storage';

export default function Dropzone() {
  const [files, setFiles] = useState<{ url: string; metadata: FullMetadata }[]>([]);
  const [progress, setprogress] = useState<number>(0);

  useEffect(() => {
    getAllDownloadUrlsFromUserFolder('18695816851681').then((res) => {
      if (res) {
        setFiles(res);
      }
    });
  }, [files]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadImage(acceptedFiles, '18695816851681', setprogress).then((res) => {
      if (res) {
        setFiles(res);
      }
      setprogress(0);
    });
  }, []);
  console.log(files);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const clsname =
    'border-2 border-dashed border-gray-300 rounded-md p-4 text-center min-h-[200px] max-w-[600px] min-w-[300px] flex flex-col justify-center items-center';

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      {progress > 0 && (
        <progress
          value={progress}
          max={100}
        ></progress>
      )}
      <div
        {...getRootProps({
          className: clsname,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <div className='w-full h-full grid grid-cols-3 gap-2'>
            {files.map((file, index) => (
              <div
                key={index}
                className='relative'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <img
                  className='w-full h-full object-cover'
                  src={file.url}
                  alt={file.metadata.name}
                />
                <div
                  onClick={() => {
                    deleteImage(file.metadata.fullPath).then((res) => {
                      if (res) {
                        setFiles(res);
                      }
                    });
                  }}
                  className='absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 cursor-pointer'
                >
                  <p>Remove</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
