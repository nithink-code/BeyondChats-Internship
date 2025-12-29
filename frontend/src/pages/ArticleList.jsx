import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { articleAPI } from '../services/api';
import './ArticleList.css';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [scraping, setScraping] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await articleAPI.getAll();
            setArticles(data);
        } catch (err) {
            setError('Failed to fetch articles. Please try again later.');
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await articleAPI.delete(id);
            setArticles(articles.filter(article => article._id !== id));
        } catch (err) {
            alert('Failed to delete article. Please try again.');
            console.error('Error deleting article:', err);
        }
    };

    const handleScrape = async () => {
        try {
            setScraping(true);
            await articleAPI.scrape();
            await fetchArticles();
            alert('Articles scraped successfully!');
        } catch (err) {
            alert('Failed to scrape articles. Please try again.');
            console.error('Error scraping articles:', err);
        } finally {
            setScraping(false);
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading articles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2 className="error-title">Oops! Something went wrong</h2>
                <p className="error-message">{error}</p>
                <button onClick={fetchArticles} className="btn btn-primary">
                    <span>🔄</span>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="article-list-page">
            <div className="container">
                {/* Header Section */}
                <div className="page-header">
                    <div className="header-content">
                        <h1 className="page-title gradient-text">
                            📚 Article Library
                        </h1>
                        <p className="page-subtitle">
                            Explore and manage your collection of articles
                        </p>
                    </div>

                    <button
                        onClick={handleScrape}
                        className="btn btn-primary"
                        disabled={scraping}
                    >
                        {scraping ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                Scraping...
                            </>
                        ) : (
                            <>
                                <span>🌐</span>
                                Scrape Articles
                            </>
                        )}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-container glass">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search articles by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="clear-search"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="search-stats">
                        <span className="badge badge-info">
                            {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'} Found
                        </span>
                    </div>
                </div>

                {/* Articles Grid */}
                {filteredArticles.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h2 className="empty-title">No Articles Found</h2>
                        <p className="empty-message">
                            {searchTerm
                                ? `No articles match your search "${searchTerm}"`
                                : 'Start by scraping articles or creating a new one'
                            }
                        </p>
                        {!searchTerm && (
                            <button onClick={handleScrape} className="btn btn-primary">
                                <span>🌐</span>
                                Scrape Articles
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="articles-grid grid grid-cols-3">
                        {filteredArticles.map((article) => (
                            <ArticleCard
                                key={article._id}
                                article={article}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleList;
