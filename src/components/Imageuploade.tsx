import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import '../index.css';
import { getAccessToken } from './authservice';
import { IoCloudUploadOutline } from 'react-icons/io5';
// import { getAccessToken } from '../components/authService';

interface UploadFile {
	name: string;
	progress: number;
	status: string | null;
}

const MAX_UPLOADS = 10;
const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB

const Imageuploade: React.FC = () => {
	const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > MAX_UPLOADS) {
			setErrorMessages([
				`You can upload a maximum of ${MAX_UPLOADS} files at a time.`,
			]);
			return;
		}

		const validFiles = acceptedFiles.filter((file) => {
			if (file.size > MAX_FILE_SIZE) {
				setErrorMessages((prevMessages) => [
					...prevMessages,
					`${file.name} exceeds the 150MB limit.,`
				]);
				return false;
			}
			return true;
		});

		const files = validFiles.map((file) => ({
			name: file.name,
			progress: 0,
			status: null,
		}));
		setUploadFiles(files);

		validFiles.forEach((file, index) => {
			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				const binaryStr = reader.result as ArrayBuffer;
				uploadToDropbox(file.name, binaryStr, index);
			};
			reader.readAsArrayBuffer(file);
		});
	}, []);

	const uploadToDropbox = async (
		fileName: string,
		fileContent: ArrayBuffer,
		index: number
	) => {
		try {
			const accessToken = await getAccessToken();
			const response = await axios.post(
				'https://content.dropboxapi.com/2/files/upload',
				fileContent,
				{
					headers: {
						'Content-Type': 'application/octet-stream',
						Authorization:` Bearer ${accessToken}`,
						'Dropbox-API-Arg': JSON.stringify({
							path: `/${fileName}`,
							mode: 'add',
							autorename: true,
							mute: false,
						}),
					},
					onUploadProgress: (progressEvent) => {
						if (progressEvent.total) {
							const progress =
								(progressEvent.loaded / progressEvent.total) * 100;
							setUploadFiles((prevFiles) => {
								const newFiles = [...prevFiles];
								newFiles[index].progress = progress;
								return newFiles;
							});
						}
					},
				}
			);
			setUploadFiles((prevFiles) => {
				const newFiles = [...prevFiles];
				newFiles[index].status = 'success';
				return newFiles;
			});
			console.log('File uploaded successfully', response.data);
		} catch (error) {
			setUploadFiles((prevFiles) => {
				const newFiles = [...prevFiles];
				newFiles[index].status = 'error';
				return newFiles;
			});
			console.error('Error uploading file', error);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<div className="font-serif bg-gray min-h-screen xl:px-[5rem] xl:py-6">
			<div className="xl:flex gap-[3rem] items-center">
			<img className="xl:h-[40rem]" src={"/AF.jpg"} alt="" />
			<div className="flex flex-col items-center">
          <h1 className="xl:text-4xl pt-5 font-bold">
            We'd love to see this day through your eyes.
          </h1>
          <p className="xl:text-lg text-center font-semibold pt-5">
            Your photos are a treasured gift to us. Please upload them here.
          </p>

			<div  {...getRootProps({ className: 'dropzone pt-8 flex flex-col items-center' })}>
			<IoCloudUploadOutline className="w-[3rem] h-[3rem]" />
				<input {...getInputProps()} />
				<p>Drag & drop some files here, or click to select files</p>
			</div>
			{errorMessages.length > 0 && (
				<div>
					{errorMessages.map((message, index) => (
						<div key={index} >
							{message}
						</div>
					))}
				</div>
			)}
			<div className='mt-4'>
            {uploadFiles.map((file, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center">
              <strong>{file.name}</strong>
              <div className="flex-1 ml-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${file.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                  <span className="text-blue-500">
                    {Math.round(file.progress)}%
                  </span>
                </div>
              </div>
            </div>
            {file.status === 'success' && (
              <div className="text-green-500 mt-2">File uploaded successfully!</div>
            )}
            {file.status === 'error' && (
              <div className="text-red-500 mt-2">Error uploading file.</div>
            )}
          </div>
        ))}
			</div>
			</div>
		</div>
		</div>
	);
};

export default Imageuploade;