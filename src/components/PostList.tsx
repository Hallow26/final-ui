import React, { useState, useRef } from 'react';

interface Comment {
  id: number;
  text: string;
  author: string;
}

interface Post {
  id: number;
  author: string;
  content: string;
  mediaUrl: string;
  createdAt: string;
  likes?: number;
  comments?: Comment[];
}

interface PostListProps {
  posts: Post[];
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedPost: { author: string; content: string; mediaUrl: string }) => void;
  onLike: (id: number) => void;
  onComment: (id: number, comment: string) => void;
  likedPosts: number[];
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#F91880" : "none"} stroke="currentColor">
    <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" 
      strokeWidth={filled ? "0" : "2"}/>
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14.06 9l.94.94L5.92 19H5v-.92L14.06 9zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" 
      fill="currentColor"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M20.746 5.236h-3.75V4.25c0-1.24-1.01-2.25-2.25-2.25h-5.5c-1.24 0-2.25 1.01-2.25 2.25v.986h-3.75c-.414 0-.75.336-.75.75s.336.75.75.75h.368l1.583 13.262c.216 1.193 1.31 2.027 2.658 2.027h8.282c1.35 0 2.442-.834 2.664-2.072l1.577-13.217h.368c.414 0 .75-.336.75-.75s-.335-.75-.75-.75z" 
      fill="currentColor"/>
  </svg>
);

const GalleryIcon = () => (
  <img
    src="https://cdn1.iconfinder.com/data/icons/pixel-perfect-at-16px-volume-1/16/2072-1024.png"
    alt="gallery"
    style={{ width: 28, height: 28, cursor: 'pointer' }}
  />
);

const profileImg = "https://www.pngmart.com/files/23/Profile-PNG-HD.png";
const commentProfileImg = "https://www.pngmart.com/files/23/Profile-PNG-HD.png";

const PostList: React.FC<PostListProps> = ({
  posts,
  onDelete,
  onEdit,
  onLike,
  onComment,
  likedPosts
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ author: string; content: string; mediaUrl: string }>({
    author: '',
    content: '',
    mediaUrl: '',
  });
  const [editMediaPreview, setEditMediaPreview] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setEditValues({ author: post.author, content: post.content, mediaUrl: post.mediaUrl });
    setEditMediaPreview(post.mediaUrl || null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleEditGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setEditValues((prev) => ({ ...prev, mediaUrl: url }));
      setEditMediaPreview(url);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      onEdit(editingId, editValues);
      setEditingId(null);
      setEditValues({ author: '', content: '', mediaUrl: '' });
      setEditMediaPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({ author: '', content: '', mediaUrl: '' });
    setEditMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCommentInput = (postId: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (commentInputs[postId]?.trim()) {
      onComment(postId, commentInputs[postId]);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <div className="post-list">
      {posts.map((post) =>
        editingId === post.id ? (
          <form key={post.id} className="post-card edit-mode" onSubmit={handleEditSubmit}>
            <div className="edit-header">
              <h3>Edit Post</h3>
              <button type="button" onClick={handleEditCancel} className="close-btn">✕</button>
            </div>
            
            <div className="edit-author-section">
              <img
                src={profileImg}
                alt="profile"
                className="edit-profile-pic"
              />
              <input
                className="edit-author"
                name="author"
                value={editValues.author}
                onChange={handleEditChange}
                required
                placeholder="Author"
                readOnly
              />
            </div>

            <textarea
              className="edit-content"
              name="content"
              value={editValues.content}
              onChange={handleEditChange}
              required
              placeholder="What's on your mind?"
              rows={4}
            />

            <div className="edit-media-section">
              <div className="media-actions">
                <button 
                  type="button"
                  onClick={handleEditGalleryClick}
                  className="icon-button"
                  title="Upload from device"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Paste image URL here"
                  value={editValues.mediaUrl}
                  onChange={(e) => setEditValues({ ...editValues, mediaUrl: e.target.value })}
                  className="url-input"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleEditFileChange}
              />
              {editMediaPreview && (
                <div className="media-preview">
                  <img src={editMediaPreview} alt="Preview" className="preview-image" />
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditValues(prev => ({ ...prev, mediaUrl: '' }));
                      setEditMediaPreview(null);
                    }}
                    className="remove-image-btn"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div className="edit-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" onClick={handleEditCancel} className="cancel-btn">Cancel</button>
            </div>
          </form>
        ) : (
          <div key={post.id} className="post-card">
            {/* Profile and author section */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <img
                src={profileImg}
                alt="profile"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  marginRight: 10
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{post.author}</h3>
                <small style={{ color: '#8899a6' }}>
                  {new Date(post.createdAt).toLocaleString()}
                </small>
              </div>
            </div>

            {/* Post content */}
            <p className="post-content">{post.content}</p>

            {/* Post image - fixed styling */}
            {post.mediaUrl && (
              <div className="post-image-container">
                <img 
                  src={post.mediaUrl} 
                  alt="Post content" 
                  className="post-image"
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '15px',
                    backgroundColor: '#253341'
                  }}
                />
              </div>
            )}

            {/* Post actions */}
            <div className="post-actions">
              <button 
                onClick={() => onLike(post.id)}
                className={`action-button like-button ${likedPosts.includes(post.id) ? 'liked' : ''}`}
                title={likedPosts.includes(post.id) ? 'Unlike' : 'Like'}
              >
                <HeartIcon filled={likedPosts.includes(post.id)} />
                <span className="action-count">{post.likes || 0}</span>
              </button>
              <button 
                onClick={() => startEdit(post)}
                className="action-button edit-button"
                title="Edit post"
              >
                <EditIcon />
              </button>
              <button 
                onClick={() => onDelete(post.id)}
                className="action-button delete-button"
                title="Delete post"
              >
                <DeleteIcon />
              </button>
            </div>

            {/* Comments section */}
            <div className="comments-section">
              <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="comment-form">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => handleCommentInput(post.id, e.target.value)}
                  className="comment-input"
                />
                <button type="submit" className="comment-btn">Comment</button>
              </form>
              {post.comments && post.comments.length > 0 && (
                <div className="comments-list">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <img
                        src={commentProfileImg}
                        alt="profile"
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          marginRight: 8
                        }}
                      />
                      <div>
                        <strong>{comment.author}</strong> {comment.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PostList;
