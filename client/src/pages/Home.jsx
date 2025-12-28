
import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const genresList = ["Action", "Isekai","Dark Fantasy", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi","Psychological","Military","Shounen","Supernatural"];

const Home = () => {
    const [animes, setAnimes] = useState([]);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [sort, setSort] = useState('newest'); 
    const [featured, setFeatured] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnimes = async () => {
        setLoading(true);
        try {
            const { data } = await API.get(`/anime?search=${search}&genre=${genre}&sort=${sort}`);
            setAnimes(data.data);
            
            
            if (!search && !genre && data.data.length > 0) {
                setFeatured(data.data[0]);
            }
        } catch (err) {
            console.error("Error fetching anime", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimes();
    }, [search, genre, sort]);

    return (
        <div>
          
            {!loading && featured && !search && !genre && (
                <div className="hero-banner" style={{
                    backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 1) 20%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.1) 100%), url(http://localhost:8888/${featured.image})`,
                    backgroundPosition: 'center right',
                    backgroundSize: 'cover',
                    minHeight: '450px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div className="hero-content" style={{ maxWidth: '600px', marginLeft: '5%' }}>
                        <span className="badge" style={{ background: 'var(--primary)', color: '#000', padding: '5px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            FEATURED
                        </span>
                        <h1 style={{ fontSize: '4rem', margin: '15px 0', textTransform: 'capitalize', lineHeight: '1.1', color: '#38bdf8' }}>
                            {featured.name}
                        </h1>
                        
                       
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <span style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                ★ {featured.ratingInfo?.averageRating || "0.0"}
                            </span>
                            <span style={{ color: '#38bdf8', fontSize: '0.9rem' }}>
                                ({featured.ratingInfo?.totalVotes || 0} reviews)
                            </span>
                        </div>

                        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '25px', lineHeight: '1.6' }}>
                            {featured.description?.substring(0, 180)}...
                        </p>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <Link to={`/anime/${featured._id}`} className="action-btn-main blue-glow-hover" style={{ textDecoration: 'none', padding: '12px 25px', borderRadius: '6px', fontWeight: 'bold' }}>
                                View Details
                            </Link>
                            <span style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'var(--accent)' }}>❤️</span> {featured.likesCount} Likes
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ padding: '0 5%' }}>
                <div style={{ margin: '3rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <h2 style={{ fontSize: '2rem', borderLeft: '4px solid var(--primary)', paddingLeft: '15px' }}>
                        {search || genre ? "Filtered Results" : "Explore Anime"}
                    </h2>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'stretch', flexWrap: 'wrap' }}>
                        <select 
                            value={sort} 
                            onChange={(e) => setSort(e.target.value)} 
                            className="action-btn-main blue-glow-hover"
                            style={{ width: '160px' }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="popular">Most Popular</option>
                            <option value="top_rated">Top Rated</option> 
                           
                        </select>

                        <select 
                            value={genre} 
                            onChange={(e) => setGenre(e.target.value)} 
                            className="action-btn-main blue-glow-hover"
                            style={{ width: '160px' }}
                        >
                            <option  value="">All Genres</option>
                            {genresList.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>

                        <input 
                            className="action-btn-main blue-glow-hover"
                            type="text" 
                            placeholder="Search title..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            style={{ width: '250px' }} 
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="anime-grid">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="anime-card skeleton-card">
                                <div className="skeleton-image shadow-pulse"></div>
                                <div className="card-content">
                                    <div className="skeleton-text skeleton-title shadow-pulse"></div>
                                    <div className="skeleton-text skeleton-genre shadow-pulse"></div>
                                    <div className="skeleton-button shadow-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="anime-grid">
                        {animes.length > 0 ? (
                            animes.map((anime) => (
                                <div key={anime._id} className="anime-card">
                                    <img src={`http://localhost:8888/${anime.image}`} alt={anime.name} />
                                    <div className="card-content">
                                        <div className="text-section">
                                           
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                                <span style={{ color: '#38bdf8', fontSize: '0.9rem' }}>★</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>
                                                    {anime.ratingInfo?.averageRating || "0.0"}
                                                </span>
                                            </div>

                                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#38bdf8', textTransform: 'capitalize' }}>
                                                {anime.name}
                                            </h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                                                {anime.genre?.join(' • ')}
                                            </p>
                                        </div>
                                        <Link to={`/anime/${anime._id}`} className="btn-outline view-details-btn">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', width: '100%', padding: '50px 0' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No matches found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ height: '100px' }}></div>
        </div>
    );
};

export default Home;