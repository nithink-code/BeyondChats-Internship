import { Link } from 'react-router-dom';
import './ArticleCard.css';

const ArticleCard = ({ article, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return 'No description available';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            await onDelete(article._id);
        }
    };

    return (
        <article className="article-card card fade-in">
            {article.imageUrl && (
                <div className="article-image-container">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="article-image"
                        loading="lazy"
                    />
                    <div className="article-overlay"></div>
                </div>
            )}

            <div className="article-content">
                <div className="article-meta">
                    <span className="badge badge-info">Article</span>
                    <span className="article-date">{formatDate(article.date || article.createdAt)}</span>
                </div>

                <h3 className="article-title">
                    <Link to={`/articles/${article._id}`}>
                        {article.title}
                    </Link>
                </h3>

                <p className="article-description">
                    {truncateText(article.description)}
                </p>

                <div className="article-actions">
                    <Link to={`/articles/${article._id}`} className="btn btn-primary">
                        <span>📖</span>
                        Read More
                    </Link>

                    <div className="action-buttons">
                        <Link to={`/edit/${article._id}`} className="btn-icon btn-secondary" title="Edit">
                            ✏️
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn-icon btn-danger"
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>

            {article.url && (
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                >
                    <span>🔗</span>
                    View Original Source
                </a>
            )}
        </article>
    );
};

export default ArticleCard;
