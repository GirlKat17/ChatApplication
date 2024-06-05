import React, { useState, useCallback } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { useFileHandler } from '@/components/useFileHandler';
import EmojiPicker from 'emoji-picker-react';
import { app } from './firebaseConfig';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function MessageInput({ sendMessage, message, setMessage, image, setImage }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Initialize storage object
  const storage = getStorage(app);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error.message);
      },
      () => {
        // Upload complete, get download URL and log it
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          // Reset file state and update message with download URL
          setFile(null);
          setImage(downloadURL);
          // Clear image preview
          setImagePreview(null);
          document.getElementById('my_modal_3').close()
        });
      }
    );
  };


  const handleEmojiClick = (emojiData,event) => {
    setMessage(prevMessage => prevMessage + emojiData.emoji);
  };

  return (
    <div className='flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700'>
      <FaPaperclip
        onClick={() => document.getElementById('my_modal_3').showModal()}
        className={`${image ? "text-blue-500" : "text-gray-500"} mr-2 cursor-pointer`}
      />
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}aria-label="Toggle emoji picker">
        😊
      </button>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type='text'
        placeholder='Type a message...'
        className='flex-1 border-none p-2 outline-none'
       
      />
      <FaPaperPlane onClick={() => sendMessage()} className='text-blue-500 cursor-pointer ml-2' />

      {showEmojiPicker && (
        <div className='absolute right-0 bottom-full p-2'>
          <EmojiPicker
           onEmojiClick={handleEmojiClick} disableAutoFocus={true} />
        </div>
      )}

      <dialog id='my_modal_3' className='modal' aria-modal="true" aria-labelledby="modal-title">
        <div className='modal-box'>
          <form method='dialog'>
            <h2 id="modal-title">Upload Image</h2>
            {imagePreview && <img src={imagePreview} alt='Uploaded preview' className='max-h-60 w-60 mb-4' />}
            <input type='file' accept='image/*' onChange={handleFileChange} aria-label="File input" />
            <div onClick={() => handleUpload(setImage)} className='btn btn-sm btn-primary'>
              Upload
            </div>
            <progress value={uploadProgress} max='100'></progress>
          </form>
          <button
            onClick={() => document.getElementById('my_modal_3').close()}
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default MessageInput;
