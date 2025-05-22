import React, { useState } from 'react';

interface EditPostProps {
  post: {
    id: number;
    author: string;
    content: string;
    mediaUrl: string;
    createdAt: string;
  };
  onUpdate: (id: number, updatedPost: { author: string; content: string; mediaUrl: string }) => void;
  onCancel: () => void;
}

const EditPost: React.FC<EditPostProps> = ({ post, onUpdate, onCancel }) => {
  const [editedPost, setEditedPost] = useState({
    author: post.author,
    content: post.content,
    mediaUrl: post.mediaUrl,
  });

  const handleSubmit = () => {
    onUpdate(post.id, editedPost);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const mediaUrl = URL.createObjectURL(file); // Generate a temporary URL for the uploaded file
      setEditedPost((prev) => ({ ...prev, mediaUrl }));
    }
  };

  return (
    <div className="edit-post">
      <input
        type="text"
        className="author-input"
        value={editedPost.author}
        onChange={(e) => setEditedPost({ ...editedPost, author: e.target.value })}
      />
      <textarea
        className="content-input"
        value={editedPost.content}
        onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
      />
      <div className="media-upload">
        <label htmlFor={`media-upload-input-${post.id}`} className="media-upload-label">
          <img
            src="https://cdn1.iconfinder.com/data/icons/pixel-perfect-at-16px-volume-1/16/2072-1024.png" // Replace with the path to your media icon
            alt="Edit media"
            className="media-icon"
          />
        </label>
        <input
          id={`media-upload-input-${post.id}`}
          type="file"
          accept="image/*"
          className="media-upload-input"
          onChange={handleMediaUpload}
        />
      </div>
      <button className="save-button" onClick={handleSubmit}>
        Save
      </button>
      <button className="cancel-button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default EditPost;