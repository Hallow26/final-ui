import React, { useState, useRef } from 'react';

interface CreatePostProps {
  onCreate: (newPost: { author: string; content: string; mediaUrl: string }) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreate }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate if it's a URL or base64
    const isValidUrl = mediaUrl.startsWith('http');
    
    onCreate({
      author,
      content,
      mediaUrl: isValidUrl ? mediaUrl : mediaUrl // Send as is if URL, otherwise it's already base64
    });

    // Reset form
    setAuthor('');
    setContent('');
    setMediaUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="media-upload-row">
        <div className="media-actions">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="icon-button"
            title="Upload from device"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="icon-button"
            title="Add image URL"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        {showUrlInput && (
          <input
            type="text"
            placeholder="Paste image URL here"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="url-input"
          />
        )}
      </div>
      {mediaUrl && (
        <div className="media-preview">
          <img src={mediaUrl} alt="Preview" className="preview-image" />
          <button
            type="button"
            onClick={() => {
              setMediaUrl('');
              setShowUrlInput(false);
            }}
            className="remove-image-btn"
          >
            Remove Image
          </button>
        </div>
      )}
      <button type="submit" className="post-button">Post</button>
    </form>
  );
};

export default CreatePost;
