import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PlaceDetail.css";

const PlaceDetail = () => {
  const { id } = useParams(); // slug or number
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPlaceDetails();
  }, [id]);

  useEffect(() => {
    if (place?.name) {
      document.title = `${place.name} | Place Details`;
    }
  }, [place]);

  const fetchPlaceDetails = async () => {
    try {
      // Convert ID to number to match MySQL database format
      const numericId = parseInt(id);
      
      if (isNaN(numericId)) {
        setError('Invalid place ID');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/places/${numericId}`);
      if (response.data) {
        // The API returns the place object directly, not wrapped in a 'place' property
        setPlace(response.data);
        setError(null);
      } else {
        setError('Place not found');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      setError('Failed to load place details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="place-detail-page loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="place-detail-page">
        <div className="error-container">
          <h2>Place not found</h2>
          <p>Sorry, we couldn't find the place you're looking for.</p>
          <button onClick={() => navigate("/places")} className="back-button">
            ← Back to Places
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-detail-page">
      <aside className="ad-space-left">Ad Space</aside>

      <main className="place-content">
        <section className="place-hero">
          <div className="hero-overlay"></div>
          <img
            src={place.image_url || "/Images/default-place.jpg"}
            alt={place.name}
            className="hero-image"
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/Images/default-place.jpg";
            }}
          />
          <div className="hero-content">
            <button 
              onClick={() => navigate("/places")} 
              className="back-button"
              id="back-button"
              name="back-button"
              aria-label="Go back to places list"
            >
              <span className="back-icon">←</span> Back to Places
            </button>
            <h1>{place.name}</h1>
            <p className="hero-subtitle">{place.location || place.city}</p>
          </div>
        </section>

        <div className="content-wrapper">
          <section className="info-section">
            <h2>About</h2>
            <p>{place.description}</p>
          </section>

          {place.highlights?.length > 0 && (
            <section className="info-section">
              <h2>Highlights</h2>
              <div className="highlights-grid">
                {place.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-card">
                    <span className="highlight-icon">✨</span>
                    <span className="highlight-text">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="info-section">
            <h2>Location</h2>
            <div className="location-card">
              <span className="location-icon">📍</span>
              <p className="location-text">{place.location || place.city}</p>
            </div>
          </section>

          {place.latitude && place.longitude && (
            <section className="info-section">
              <h2>Map</h2>
              <iframe
                title="map"
                src={`https://www.google.com/maps?q=${place.latitude},${place.longitude}&z=14&output=embed`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </section>
          )}

          <div className="info-grid">
            {place.best_time_to_visit && (
              <div className="info-card">
                <div className="info-icon">⏰</div>
                <h3>Best Time to Visit</h3>
                <p>{place.best_time_to_visit}</p>
              </div>
            )}

            {place.how_to_reach && (
              <div className="info-card">
                <div className="info-icon">🚗</div>
                <h3>How to Reach</h3>
                <p>{place.how_to_reach}</p>
              </div>
            )}

            {place.entry_fee && (
              <div className="info-card">
                <div className="info-icon">💰</div>
                <h3>Entry Fee</h3>
                <p>{place.entry_fee}</p>
              </div>
            )}

            {place.timings && (
              <div className="info-card">
                <div className="info-icon">🕒</div>
                <h3>Timings</h3>
                <p>{place.timings}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <aside className="ad-space-right">Ad Space</aside>
    </div>
  );
};

export default PlaceDetail;


