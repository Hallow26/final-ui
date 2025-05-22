import React, { useState } from 'react';

interface PostItemProps {
  post: {
    id: number;
    author: string;
    content: string;
    mediaUrl?: string;
    createdAt: string;
    likes?: number;
  };
  onDelete: (id: number) => void;
  onEdit: (id: number, updates: any) => void;
  onLike: (id: number) => void;
  onComment: (id: number, comment: string) => void;
  isLiked: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, onDelete, onEdit, onLike, onComment, isLiked }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [comment, setComment] = useState('');

  const handleSave = () => {
    onEdit(post.id, { ...post, content: editContent });
    setIsEditing(false);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment('');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
        <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      
      {isEditing ? (
        <div className="edit-mode">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-content"
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className="post-content">{post.content}</p>
          {post.mediaUrl && (
            <img src={post.mediaUrl} alt="Post media" className="post-media" />
          )}
        </>
      )}

      <div className="post-actions">
        <button onClick={() => onLike(post.id)}>
          {isLiked ? '👍 Liked' : '👍 Like'} {post.likes || 0}
        </button>
        <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
        <button onClick={() => onDelete(post.id)}>🗑️ Delete</button>
      </div>

      <form onSubmit={handleComment} className="comment-form">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button type="submit" className="comment-btn">Comment</button>
      </form>
    </div>
  );
};

export default PostItem;