import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/postService';
import { toast } from 'react-toastify';

const PostForm = ({ initialPost = null }) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialPost?.imageUrl || null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const post = await postService.getPostById(id);
          setTitle(post.title);
          setContent(post.content);
          setPreview(post.imageUrl);
        } catch (err) {
          setError('Failed to fetch post');
          console.error(err);
        }
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setPreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim()) {
      toast.error('Title cannot be empty', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!content.trim()) {
      toast.error('Content cannot be empty', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    // Confirmation dialog
    const confirmSubmit = await new Promise((resolve) => {
      const toastId = toast(
        <div>
          <p>
            {id 
              ? 'Are you sure you want to update this post?' 
              : 'Are you sure you want to create this post?'}
          </p>
          <div>
            <button 
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }} 
              className="btn btn-sm btn-success me-2"
            >
              Yes
            </button>
            <button 
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }} 
              className="btn btn-sm btn-danger"
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
    
    if (!confirmSubmit) {
      toast.info('Post submission cancelled', {
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
      const postData = { title, content, image };
      
      if (id) {
        // Update existing post
        await postService.updatePost(id, postData);
        toast.success('Post updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Create new post
        await postService.createPost(postData);
        toast.success('New post created successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
      navigate('/');
    } catch (err) {
      toast.error(`Failed to ${id ? 'update' : 'create'} post: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError(err.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 fw-bold">
                {id ? 'Edit Post' : 'Create New Post'}
              </h2>
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="form-label fw-semibold">Content</label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows="6"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here..."
                    required
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {preview && (
                      <div className="image-preview mt-3 text-center">
                        <div className="position-relative d-inline-block">
                          <img
                            src={preview}
                            alt="Preview"
                            className="rounded shadow-sm"
                            style={{
                              maxHeight: '250px',
                              maxWidth: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    style={{
                      background: 'linear-gradient(to right, #4776E6, #8E54E9)',
                      border: 'none'
                    }}
                  >
                    {id ? 'Update Post' : 'Create Post'} 
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;