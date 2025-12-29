import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar glass">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">📰</span>
                    <span className="brand-text gradient-text">BeyondChats</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">
                        <span className="nav-icon">🏠</span>
                        Home
                    </Link>
                    <Link to="/articles" className="nav-link">
                        <span className="nav-icon">📚</span>
                        Articles
                    </Link>
                    <Link to="/create" className="nav-link btn-primary">
                        <span className="nav-icon">✨</span>
                        Create Article
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
