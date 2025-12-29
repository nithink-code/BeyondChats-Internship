import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleForm from './pages/ArticleForm';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/articles" element={<ArticleList />} />
                        <Route path="/articles/:id" element={<ArticleDetail />} />
                        <Route path="/create" element={<ArticleForm />} />
                        <Route path="/edit/:id" element={<ArticleForm />} />
                    </Routes>
                </main>
                <footer className="footer">
                    <div className="container">
                        <p className="footer-text">
                            © {new Date().getFullYear()} BeyondChats. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
