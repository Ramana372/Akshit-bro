import React, { useState } from 'react';
import './ExpertHistory.css';

const ExpertHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const expert = {
    name: 'Akshit',
    role: 'Travel Photographer',
    bio: 'Passionate about capturing stories through landscapes and cultures worldwide. With over 10 years of experience, I specialize in documenting unique cultural experiences and breathtaking natural landscapes.',
    profileImage: '/Images/Akshit.jpg',
    achievements: [
      {
        title: 'National Geographic Featured Photographer',
        icon: '📸',
        year: '2023'
      },
      {
        title: 'Winner of World Travel Photography Award',
        icon: '🏆',
        year: '2022'
      },
      {
        title: 'Published in Lonely Planet Magazine',
        icon: '📚',
        year: '2021'
      },
      {
        title: 'Featured in Travel + Leisure',
        icon: '✈️',
        year: '2023'
      }
    ],
  };

  const travelData = [
    {
      place: 'Warangal',
      description: 'The City of Temples',
      media: [
        { 
          type: 'photo', 
          url: '/Images/Warangal Fort.jpg', 
          alt: 'Historic Warangal Fort',
          description: 'Ancient ruins of the Kakatiya dynasty.',
          tags: ['History', 'Architecture', 'Heritage'],
          relatedVideos: []
        },
        { 
          type: 'photo', 
          url: '/Images/1000pillerstemple.jpg', 
          alt: 'Thousand Pillar Temple',
          description: 'A marvel of Kakatiya architecture.',
          tags: ['Temple', 'Architecture', 'Heritage'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/Ramappa temple.jpg',
          alt: 'Ramappa Temple',
          description: 'UNESCO World Heritage Site showcasing Kakatiya architecture.',
          tags: ['Temple', 'UNESCO', 'Heritage'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Laknavaram',
      description: 'Scenic Lake Paradise',
      media: [
        { 
          type: 'photo', 
          url: '/Images/Laknavaram lake bridge.jpg', 
          alt: 'Laknavaram Lake Bridge',
          description: 'Suspension bridge over serene waters.',
          tags: ['Nature', 'Lake', 'Bridge'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/carousel-img1.jpg',
          alt: 'Laknavaram Lake View',
          description: 'Panoramic view of the lake.',
          tags: ['Nature', 'Lake', 'Scenic'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Horsley Hills',
      description: 'Andhra Pradesh\'s Hill Station',
      media: [
        { 
          type: 'photo', 
          url: '/Images/Horsely_hills.jpg', 
          alt: 'Horsley Hills View',
          description: 'Panoramic view of lush green hills.',
          tags: ['Hills', 'Nature', 'Scenic'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/carousel-img2.jpg',
          alt: 'Horsley Hills Sunset',
          description: 'Golden hues of a hilltop sunset.',
          tags: ['Hills', 'Sunset', 'Nature'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Waterfalls',
      description: 'Nature\'s Majestic Waterfalls',
      media: [
        { 
          type: 'photo', 
          url: '/Images/Kothapalli-waterfalls.jpg', 
          alt: 'Kothapalli Waterfalls',
          description: 'Cascading waters amidst lush greenery.',
          tags: ['Waterfall', 'Nature', 'Adventure'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/Thalakona waterfalls.jpg',
          alt: 'Thalakona Waterfalls',
          description: 'Majestic waterfall in a serene setting.',
          tags: ['Waterfall', 'Nature', 'Scenic'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/tonkota waterfalls.jpg',
          alt: 'Tonkota Waterfalls',
          description: 'Hidden gem in the wilderness.',
          tags: ['Waterfall', 'Nature', 'Adventure'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/Kapila therdham water falls.jpg',
          alt: 'Kapila Theertham Waterfalls',
          description: 'Sacred waterfall near Tirupati.',
          tags: ['Waterfall', 'Temple', 'Nature'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Lambasingi',
      description: 'Kashmir of Andhra Pradesh',
      media: [
        {
          type: 'photo',
          url: '/Images/Lambasingi.jpg',
          alt: 'Lambasingi Hills',
          description: 'Known for its cold climate and misty mornings.',
          tags: ['Hills', 'Nature', 'Climate'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Armakonda',
      description: 'Mystical Mountain Range',
      media: [
        {
          type: 'photo',
          url: '/Images/Armakonda_peak.jpg',
          alt: 'Armakonda Peak',
          description: 'Majestic peak offering breathtaking views.',
          tags: ['Mountain', 'Nature', 'Adventure'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/Tribal village near armakonda.jpg',
          alt: 'Tribal Village',
          description: 'Traditional tribal settlement near Armakonda.',
          tags: ['Culture', 'Village', 'Heritage'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Chandragiri',
      description: 'Historic Fort City',
      media: [
        {
          type: 'photo',
          url: '/Images/Chandaragiri_fort.jpg',
          alt: 'Chandragiri Fort',
          description: 'Ancient fort with rich historical significance.',
          tags: ['Fort', 'History', 'Architecture'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/Chandaragiri_fort2.jpg',
          alt: 'Chandragiri Fort View',
          description: 'Panoramic view of the historic fort.',
          tags: ['Fort', 'History', 'Scenic'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Gudisa',
      description: 'Hidden Hill Station',
      media: [
        {
          type: 'photo',
          url: '/Images/Gudisa_hill_station.jpg',
          alt: 'Gudisa Hill Station',
          description: 'Serene hill station with panoramic views.',
          tags: ['Hills', 'Nature', 'Scenic'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Lepakshi',
      description: 'Ancient Temple Town',
      media: [
        {
          type: 'photo',
          url: '/Images/Lepakshi Temple.jpg',
          alt: 'Lepakshi Temple',
          description: 'Famous for its hanging pillar and intricate carvings.',
          tags: ['Temple', 'Architecture', 'Heritage'],
          relatedVideos: []
        },
        {
          type: 'photo',
          url: '/Images/Lepakshi Nandi.jpg',
          alt: 'Lepakshi Nandi',
          description: 'Monolithic Nandi statue at Lepakshi.',
          tags: ['Temple', 'Sculpture', 'Heritage'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Samshabad',
      description: 'Temple Heritage',
      media: [
        {
          type: 'photo',
          url: '/Images/Seetaramachandraswami Temple, Samshabad.jpg',
          alt: 'Seetaramachandraswami Temple',
          description: 'Ancient temple with rich architectural heritage.',
          tags: ['Temple', 'Architecture', 'Heritage'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Mardumilli',
      description: 'Tribal Heritage',
      media: [
        {
          type: 'photo',
          url: '/Images/mardumilli.jpg',
          alt: 'Mardumilli',
          description: 'Rich in tribal culture and natural beauty.',
          tags: ['Culture', 'Nature', 'Heritage'],
          relatedVideos: []
        }
      ],
    },
    {
      place: 'Ponguleru',
      description: 'River Valley',
      media: [
        {
          type: 'photo',
          url: '/Images/Ponguleru vaagu.jpg',
          alt: 'Ponguleru Vaagu',
          description: 'Scenic river valley with natural beauty.',
          tags: ['River', 'Nature', 'Scenic'],
          relatedVideos: []
        }
      ],
    }
  ];

  const filteredGallery = travelData.filter((location) =>
    location.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMediaClick = (media, location) => {
    setSelectedMedia({ ...media, location });
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="expert-history-container">
      {/* Hero Section */}
      <section className="expert-hero">
        <div className="expert-hero-content">
          <img
            src={expert.profileImage}
            alt={`${expert.name} profile`}
            className="profile-pic"
            loading="lazy"
          />
          <h1>{expert.name}</h1>
          <h3>{expert.role}</h3>
          <p>{expert.bio}</p>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="expert-section achievements">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {expert.achievements.map((item, index) => (
            <div key={index} className="achievement-card">
              <span className="achievement-icon" aria-hidden="true">{item.icon}</span>
              <p>{item.title}</p>
              <span className="achievement-year">{item.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Gallery Section */}
      <section className="expert-section travel-gallery">
        <h2>Travel Gallery</h2>
        <div className="expert-search-container">
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="expert-search-input"
            aria-label="Search travel locations"
          />
          <span className="expert-search-icon" aria-hidden="true">🔍</span>
        </div>
        {filteredGallery.length > 0 ? (
          filteredGallery.map((location, index) => (
            <div key={index} className="place-section">
              <h3>{location.place}</h3>
              <p className="place-description">{location.description}</p>
              <div className="media-grid">
                {location.media.map((item, idx) => (
                  <div
                    key={idx}
                    className="media-item"
                    onClick={() => handleMediaClick(item, location)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleMediaClick(item, location)}
                    aria-label={`View ${item.alt}`}
                  >
                    <img
                      className="media-content"
                      src={item.url}
                      alt={item.alt}
                      loading="lazy"
                    />
                    <div className="media-overlay">
                      <h4 className="media-title">{item.alt}</h4>
                      <p className="media-description">{item.description}</p>
                      <div className="media-tags">
                        {item.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="media-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>No locations found matching your search.</p>
            <p>Try searching for a different location or browse all destinations.</p>
          </div>
        )}
      </section>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="media-modal" onClick={closeModal}>
          <div className="media-modal-content" onClick={e => e.stopPropagation()} role="dialog" aria-labelledby="modal-title">
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">×</button>
            
            <div className="modal-header">
              <h2 id="modal-title">{selectedMedia.alt}</h2>
            </div>

            <div className="modal-main-content">
              <div className="modal-image-container">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt}
                  className="modal-image"
                  loading="lazy"
                />
              </div>
              
              <div className="modal-info">
                <p className="modal-description">{selectedMedia.description}</p>
                <div className="modal-tags">
                  {selectedMedia.tags.map((tag, index) => (
                    <span key={index} className="modal-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {selectedMedia.relatedVideos && selectedMedia.relatedVideos.length > 0 && (
              <div className="modal-related-videos">
                <h3>Related Videos</h3>
                <div className="related-videos-grid">
                  {selectedMedia.relatedVideos.map((video, index) => (
                    <div key={index} className="related-video-item">
                      {video.type === 'video' ? (
                        <video
                          src={video.url}
                          controls
                          className="related-video"
                          poster={video.thumbnail}
                          aria-label={video.alt}
                        />
                      ) : (
                        <div className="youtube-wrapper">
                          <iframe
                            src={video.url}
                            title={video.alt}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="related-video"
                            loading="lazy"
                          ></iframe>
                        </div>
                      )}
                      <div className="related-video-info">
                        <h4>{video.alt}</h4>
                        <div className="video-stats">
                          <span><span className="views-icon" aria-hidden="true">👁️</span> {video.views} views</span>
                          <span><span className="duration-icon" aria-hidden="true">⏱️</span> {video.duration}</span>
                        </div>
                        {video.youtubeLink && (
                          <a
                            href={video.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="youtube-link"
                            aria-label={`Watch ${video.alt} on YouTube`}
                          >
                            <span className="youtube-icon" aria-hidden="true">▶</span>
                            Watch on YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call-to-Action Section */}
      <section className="expert-cta">
        <h2>Explore More with {expert.name}</h2>
        <p>Discover breathtaking moments captured around the globe.</p>
        <div className="cta-buttons">
          <button className="explore-button">View Full Portfolio</button>
          <button className="login-button">Contact Expert</button>
        </div>
      </section>
    </div>
  );
};

export default ExpertHistory;