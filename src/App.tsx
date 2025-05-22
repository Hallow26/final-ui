import React, { useState, useEffect, useCallback } from 'react';
import './styles/app.css';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';

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

const App: React.FC = () => {
  
  const API_URL = 'https://final-api-nkm9.onrender.com'; // backend URL

  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>(() => {
    const stored = localStorage.getItem('likedPosts');
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      console.log('Fetching posts from:', `${API_URL}/posts`); // Debug log
      const response = await fetch(`${API_URL}/posts`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched posts data:', data); // Debug log
      
      // Ensure data is an array and sort by creation date
      const postsArray = Array.isArray(data) ? data : [];
      const sortedPosts = postsArray.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log('Sorted posts:', sortedPosts); // Debug log
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [API_URL]);

  // Store liked posts in localStorage
  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  // Handle creating a new post
  const handleCreatePost = async (newPost: { 
    author: string; 
    content: string; 
    mediaUrl: string | File 
  }) => {
    try {
      const formData = new FormData();
      formData.append('author', newPost.author);
      formData.append('content', newPost.content);
      
      if (newPost.mediaUrl instanceof File) {
        formData.append('media', newPost.mediaUrl);
      } else if (typeof newPost.mediaUrl === 'string' && newPost.mediaUrl.startsWith('http')) {
        formData.append('mediaUrl', newPost.mediaUrl);
      }

      formData.append('createdAt', new Date().toISOString());
      formData.append('likes', '0');

      console.log('Sending post request with data:', {
        author: newPost.author,
        content: newPost.content,
        mediaUrl: newPost.mediaUrl instanceof File ? 'File object' : newPost.mediaUrl
      });

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Post creation response:', data);

      // Fetch all posts again to ensure we have the latest data
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (id: number) => {
    try {
      if (!id) {
        console.error('Invalid post ID');
        return;
      }

      const response = await fetch(`${API_URL}/posts/${id}`, { 
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // After successful delete, fetch all posts again
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Handle editing a post
  const handleEditPost = async (id: number, updatedPost: { author: string; content: string; mediaUrl: string }) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // After successful edit, fetch all posts again
      await fetchPosts();
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  // Handle liking a post
  const handleLikePost = (id: number) => {
    if (likedPosts.includes(id)) {
      // Unlike: remove from likedPosts and decrease like count
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? { ...post, likes: post.likes && post.likes > 0 ? post.likes - 1 : 0 }
            : post
        )
      );
      setLikedPosts((prev) => prev.filter((postId) => postId !== id));
    } else {
      // Like: add to likedPosts and increase like count
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, likes: (post.likes ?? 0) + 1 } : post
        )
      );
      setLikedPosts((prev) => [...prev, id]);
    }
    // Optionally notify backend here
  };

  // Handle commenting on a post
  const handleCommentPost = (id: number, comment: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [
                ...(post.comments || []),
                { id: Date.now(), text: comment, author: 'USER' },
              ],
            }
          : post
      )
    );
    // Optionally, send comment to backend here
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };
    
    loadPosts();
  }, [fetchPosts]);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <CreatePost onCreate={handleCreatePost} />
        {loading ? (
          <div className="loading-spinner">Loading posts...</div>
        ) : posts.length > 0 ? (
          <PostList
            posts={posts}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
            onLike={handleLikePost}
            onComment={handleCommentPost}
            likedPosts={likedPosts}
          />
        ) : (
          <div className="no-posts">
            <p>No posts found. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
