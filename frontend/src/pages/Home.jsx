import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>

                <div className="container hero-content">
                    <div className="hero-text fade-in">
                        <h1 className="hero-title">
                            Welcome to <span className="gradient-text">BeyondChats</span>
                        </h1>
                        <p className="hero-subtitle">
                            Discover, manage, and enhance your articles with AI-powered content optimization.
                            Transform your content strategy with intelligent article management.
                        </p>

                        <div className="hero-actions">
                            <Link to="/articles" className="btn btn-primary btn-lg">
                                <span>📚</span>
                                Browse Articles
                            </Link>
                            <Link to="/create" className="btn btn-outline btn-lg">
                                <span>✨</span>
                                Create New Article
                            </Link>
                        </div>
                    </div>

                    <div className="hero-stats fade-in">
                        <div className="stat-card glass">
                            <div className="stat-icon">📰</div>
                            <div className="stat-value">500+</div>
                            <div className="stat-label">Articles Managed</div>
                        </div>

                        <div className="stat-card glass">
                            <div className="stat-icon">🤖</div>
                            <div className="stat-value">AI-Powered</div>
                            <div className="stat-label">Content Enhancement</div>
                        </div>

                        <div className="stat-card glass">
                            <div className="stat-icon">⚡</div>
                            <div className="stat-value">Real-time</div>
                            <div className="stat-label">Updates & Sync</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title text-center gradient-text">
                        Powerful Features
                    </h2>
                    <p className="section-subtitle text-center">
                        Everything you need to manage and optimize your content
                    </p>

                    <div className="features-grid grid grid-cols-3">
                        <div className="feature-card card fade-in">
                            <div className="feature-icon">🔍</div>
                            <h3 className="feature-title">Smart Search</h3>
                            <p className="feature-description">
                                Find articles instantly with our intelligent search and filtering system.
                            </p>
                        </div>

                        <div className="feature-card card fade-in">
                            <div className="feature-icon">✏️</div>
                            <h3 className="feature-title">Easy Editing</h3>
                            <p className="feature-description">
                                Update and manage your articles with our intuitive editor interface.
                            </p>
                        </div>

                        <div className="feature-card card fade-in">
                            <div className="feature-icon">🌐</div>
                            <h3 className="feature-title">Web Scraping</h3>
                            <p className="feature-description">
                                Automatically fetch and import articles from external sources.
                            </p>
                        </div>

                        <div className="feature-card card fade-in">
                            <div className="feature-icon">🎨</div>
                            <h3 className="feature-title">Beautiful UI</h3>
                            <p className="feature-description">
                                Enjoy a modern, responsive interface designed for productivity.
                            </p>
                        </div>

                        <div className="feature-card card fade-in">
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Analytics</h3>
                            <p className="feature-description">
                                Track article performance and engagement with detailed insights.
                            </p>
                        </div>

                        <div className="feature-card card fade-in">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Secure & Reliable</h3>
                            <p className="feature-description">
                                Your data is protected with enterprise-grade security measures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-card glass">
                        <h2 className="cta-title gradient-text">
                            Ready to Get Started?
                        </h2>
                        <p className="cta-description">
                            Join thousands of content creators who trust BeyondChats for their article management needs.
                        </p>
                        <Link to="/articles" className="btn btn-primary btn-lg">
                            <span>🚀</span>
                            Explore Articles Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
