import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import './ArticleForm.css';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            setFetching(true);
            const data = await articleAPI.getById(id);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                url: data.url || '',
                imageUrl: data.imageUrl || '',
                date: data.date ? new Date(data.date).toISOString().split('T')[0] : ''
            });
        } catch (err) {
            setError('Failed to fetch article details.');
            console.error('Error fetching article:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                await articleAPI.update(id, formData);
            } else {
                await articleAPI.create(formData);
            }
            navigate('/articles');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save article. Please check your inputs.');
            console.error('Error saving article:', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading article data...</p>
            </div>
        );
    }

    return (
        <div className="article-form-page">
            <div className="container">
                <div className="form-wrapper card fade-in">
                    <div className="form-header">
                        <h1 className="form-title gradient-text">
                            {isEditing ? 'Edit Article' : 'Create New Article'}
                        </h1>
                        <p className="form-subtitle">
                            {isEditing
                                ? 'Update the details of your existing article'
                                : 'Fill in the details below to add a new article to your library'
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="article-form">
                        <div className="form-group">
                            <label htmlFor="title">Article Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter article title"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter a brief description of the article..."
                                rows="4"
                                className="form-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="url">Source URL *</label>
                                <div className="input-with-icon">
                                    <span className="input-icon">🔗</span>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleChange}
                                        placeholder="https://example.com/article"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Publish Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageUrl">Image URL</label>
                            <div className="input-with-icon">
                                <span className="input-icon">🖼️</span>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {formData.imageUrl && (
                            <div className="image-preview">
                                <p className="preview-label">Image Preview:</p>
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        <div className="form-actions">
                            <Link to="/articles" className="btn btn-secondary">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span>💾</span>
                                        {isEditing ? 'Update Article' : 'Create Article'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArticleForm;
