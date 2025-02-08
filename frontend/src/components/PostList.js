import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postService.getAllPosts();
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    // Confirmation dialog using toast
    const confirmDelete = await new Promise((resolve) => {
      const toastId = toast(
        <div>
          <p>Are you sure you want to delete this post?</p>
          <div>
            <button 
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }} 
              className="btn btn-sm btn-danger me-2"
            >
              Yes
            </button>
            <button 
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }} 
              className="btn btn-sm btn-secondary"
            >
              No
            </button>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          closeButton: false,
        }
      );
    });
    
    if (!confirmDelete) {
      toast.info('Post deletion cancelled', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    try {
      await postService.deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
      
      toast.success('Post deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(`Failed to delete post: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError(err);
    }
  };

  if (loading) return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading posts...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>Error: {error.message}</div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">My Posts</h2>
        <Link 
          to="/create" 
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(to right, #4776E6, #8E54E9)',
            border: 'none',
            padding: '0.625rem 1.25rem'
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="min-vh-50 d-flex flex-column justify-content-center align-items-center text-center py-5">
          <div className="mb-4">
            <i className="bi bi-journal-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
          </div>
          <h3 className="fw-light mb-3">No Posts Yet</h3>
          <p className="text-muted mb-4">Start creating your first post by clicking the button above!</p>
          <Link 
            to="/create" 
            className="btn btn-outline-primary btn-lg"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {posts.map(post => (
            <div key={post._id} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-shadow transition-all">
                {post.imageUrl ? (
                  <div className="card-img-wrapper position-relative" style={{ height: '200px' }}>
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="card-img-top"
                      style={{ 
                        height: '100%',
                        objectFit: 'cover',
                        borderTopLeftRadius: 'calc(0.375rem - 1px)',
                        borderTopRightRadius: 'calc(0.375rem - 1px)'
                      }}
                    />
                  </div>
                ) : (
                  <div 
                    className="card-img-top d-flex align-items-center justify-content-center bg-light"
                    style={{ height: '200px' }}
                  >
                    <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }}></i>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">{post.title}</h5>
                  <p className="card-text text-muted">
                    {post.content.length > 100 
                      ? `${post.content.substring(0, 100)}...` 
                      : post.content}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0 pb-3">
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/edit/${post._id}`} 
                      className="btn btn-outline-primary flex-grow-1"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(post._id)} 
                      className="btn btn-outline-danger flex-grow-1"
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;