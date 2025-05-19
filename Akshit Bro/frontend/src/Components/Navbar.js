import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { placesData } from '../data';
import './Navbar.css';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 0) {
                try {
                    setIsSearching(true);
                    setSearchError(null);
                    console.log('Searching for:', searchTerm);

                    const localResults = Object.entries(placesData)
                        .filter(([_, place]) => {
                            const searchLower = searchTerm.toLowerCase();
                            return (
                                place.name.toLowerCase().includes(searchLower) ||
                                place.city?.toLowerCase().includes(searchLower) ||
                                place.location?.toLowerCase().includes(searchLower) ||
                                place.description?.toLowerCase().includes(searchLower)
                            );
                        })
                        .map(([id, place]) => ({
                            id,
                            name: place.name,
                            city: place.city || place.location,
                            description: place.description,
                            image_url: place.image_url
                        }));

                    if (localResults.length > 0) {
                        console.log('Found results in local data:', localResults);
                        setSearchResults(localResults);
                        setShowResults(true);
                        return;
                    }

                    // If no local results, try API
                    const response = await axios.get(`http://localhost:5000/search?q=${encodeURIComponent(searchTerm)}`);
                    console.log('Search results from API:', response.data);
                    setSearchResults(response.data.places || []);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchError('Failed to search places. Please try again.');
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleResultClick = (place) => {
        console.log('Selected place:', place);
        setShowResults(false);
        setSearchTerm('');
        navigate(`/places/${place.id}`);
        setMenuOpen(false);
    };

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
                    Travel Guide
                </Link>

                <button className="menu-toggle" onClick={handleMenuToggle}>
                    ☰
                </button>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search places or cities..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    {isSearching && (
                        <div className="search-loading">Searching...</div>
                    )}
                    {searchError && (
                        <div className="search-error">{searchError}</div>
                    )}
                    {showResults && searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((place) => (
                                <div
                                    key={place.id}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(place)}
                                >
                                    <div className="search-result-image">
                                        <img
                                            src={place.image_url || '/Images/default-place.jpg'}
                                            alt={place.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/Images/default-place.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="search-result-info">
                                        <h4>{place.name}</h4>
                                        <p className="result-location">📍 {place.city || place.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {showResults && searchResults.length === 0 && !isSearching && (
                        <div className="search-no-results">No places found</div>
                    )}
                </div>

                <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={handleLinkClick}>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/places" className="nav-link" onClick={handleLinkClick}>
                            Places
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/Expert" className="nav-link" onClick={handleLinkClick}>
                            Expert
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-link" onClick={handleLinkClick}>
                            About
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link login-link" onClick={handleLinkClick}>
                            Login
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
