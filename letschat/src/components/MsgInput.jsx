import React, { useState, useCallback } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { useFileHandler } from '@/components/useFileHandler';
import EmojiPicker from 'emoji-picker-react';

function MessageInput({ sendMessage, message, setMessage, image, setImage }) {
  const { file, uploadProgress, imagePreview, handleFileChange, handleUpload } = useFileHandler();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
  }, []);

  const handleEmojiClick = useCallback((emojiData) => {
    setMessage(prevMessage => prevMessage + emojiData.emoji);
  }, [setMessage]);

  return (
    <div className='relative flex items-center p-4 border-t border-gray-200'>
      <FaPaperclip
        onClick={() => document.getElementById('my_modal_3').showModal()}
        className={`${image ? "text-blue-500" : "text-gray-500"} mr-2 cursor-pointer`}
      />
      <button onClick={toggleEmojiPicker} aria-label="Toggle emoji picker">
        😊
      </button>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type='text'
        placeholder='Type a message...'
        className='flex-1 border-none p-2 outline-none'
        aria-label="Message input"
      />
      <FaPaperPlane onClick={sendMessage} className='text-blue-500 cursor-pointer ml-2' aria-label="Send message" />

      {showEmojiPicker && (
        <div className='absolute right-0 bottom-full p-2'>
          <EmojiPicker onEmojiClick={handleEmojiClick} disableAutoFocus />
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
