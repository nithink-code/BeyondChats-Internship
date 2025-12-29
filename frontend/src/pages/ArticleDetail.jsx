import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import './ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await articleAPI.getById(id);
            setArticle(data);
        } catch (err) {
            setError('Failed to fetch article details.');
            console.error('Error fetching article:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await articleAPI.delete(id);
                navigate('/articles');
            } catch (err) {
                alert('Failed to delete article. Please try again.');
                console.error('Error deleting article:', err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading article...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2 className="error-title">Article Not Found</h2>
                <p className="error-message">{error || 'The article you are looking for does not exist.'}</p>
                <Link to="/articles" className="btn btn-primary">
                    <span>←</span>
                    Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="article-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="separator">›</span>
                    <Link to="/articles">Articles</Link>
                    <span className="separator">›</span>
                    <span className="current">{article.title}</span>
                </nav>

                {/* Article Header */}
                <header className="article-header fade-in">
                    <div className="header-meta">
                        <span className="badge badge-info">Article</span>
                        <span className="article-date">
                            📅 {formatDate(article.date || article.createdAt)}
                        </span>
                    </div>

                    <h1 className="article-title">{article.title}</h1>

                    {article.description && (
                        <p className="article-lead">{article.description}</p>
                    )}

                    <div className="article-actions">
                        <Link to={`/edit/${article._id}`} className="btn btn-secondary">
                            <span>✏️</span>
                            Edit Article
                        </Link>
                        <button onClick={handleDelete} className="btn btn-outline" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
                            <span>🗑️</span>
                            Delete Article
                        </button>
                    </div>
                </header>

                {/* Article Image */}
                {article.imageUrl && (
                    <div className="article-image-wrapper fade-in">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="article-image"
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="article-body card fade-in">
                    <div className="content-section">
                        <h2>📝 Article Information</h2>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Title:</span>
                                <span className="info-value">{article.title}</span>
                            </div>

                            {article.description && (
                                <div className="info-item">
                                    <span className="info-label">Description:</span>
                                    <span className="info-value">{article.description}</span>
                                </div>
                            )}

                            <div className="info-item">
                                <span className="info-label">Created:</span>
                                <span className="info-value">{formatDate(article.createdAt)}</span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">Last Updated:</span>
                                <span className="info-value">{formatDate(article.updatedAt)}</span>
                            </div>

                            {article.url && (
                                <div className="info-item">
                                    <span className="info-label">Source URL:</span>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="info-link"
                                    >
                                        {article.url}
                                        <span className="external-icon">🔗</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {article.url && (
                        <div className="source-section">
                            <h3>🌐 Original Source</h3>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <span>🔗</span>
                                Visit Original Article
                            </a>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="article-navigation">
                    <Link to="/articles" className="btn btn-secondary">
                        <span>←</span>
                        Back to All Articles
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
