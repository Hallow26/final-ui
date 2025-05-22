import React from 'react';

export interface Post {
  id: number;
  author: string;
  content: string;
  mediaUrl: string;
  createdAt: string;
  likes: number;
}

interface Comment {
  id: number;
  text: string;
  author: string;
}

interface PostProps {
  id: number;
  author: string;
  content: string;
  mediaUrl: string;
  createdAt: string;
  comments?: Comment[];
  onEdit: () => void;
  onDelete: () => void;
}

const profileImg = "https://www.pngmart.com/files/23/Profile-PNG-HD.png";
const commentProfileImg = "https://www.pngmart.com/files/23/Profile-PNG-HD.png";

const Post: React.FC<PostProps> = ({
  author,
  content,
  mediaUrl,
  createdAt,
  comments,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="post" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderBottom: '1px solid #eee' }}>
      {/* Post profile pic and author */}
      <img
        src={profileImg}
        alt="profile"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: 10,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0 }}>{author}</h3>
          <span style={{ color: '#999', fontSize: 13 }}>{new Date(createdAt).toLocaleString()}</span>
        </div>
        <p style={{ margin: '7px 0 10px 0' }}>{content}</p>
        {mediaUrl && (
          <img
            src={mediaUrl}
            alt="Media"
            style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 8 }}
          />
        )}
        <div>
          <button className="edit-button" onClick={onEdit}>
            Edit
          </button>
          <button className="delete-button" onClick={onDelete}>
            Delete
          </button>
        </div>
        {/* Comments with profile pic */}
        {comments && comments.length > 0 && (
          <div className="comments-list" style={{ marginTop: 16 }}>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item" style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                <img
                  src={commentProfileImg}
                  alt="profile"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    marginRight: 8,
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <strong>{comment.author}:</strong> {comment.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
