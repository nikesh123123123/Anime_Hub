
import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "" });

    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const fetchFavorites = async () => {
        try {
            const { data } = await API.get('/fav');
            
            if (Array.isArray(data)) {
                setFavorites(data.filter(f => f.anime !== null));
            } else if (data && data.favorites) {
                setFavorites(data.favorites.filter(f => f.anime !== null));
            } else {
                setFavorites([]);
            }
            
            setLoading(false);
        } catch (err) {
            console.error("Fetch error", err);
            setLoading(false);
        }
    };

    const handleRemove = async (animeId) => {
        try {
            await API.delete(`/fav/${animeId}`);
            setFavorites(favorites.filter(fav => fav.anime?._id !== animeId));
            showToast("Removed from Favorites 🗑️");
        } catch (err) {
            showToast("Could not remove favorite");
        }
    };

    useEffect(() => { fetchFavorites(); }, []);

    if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', color: '#fff' }}>
            
            {toast.show && (
                <div className="toast-container">
                    {toast.message}
                </div>
            )}

            <h2 style={{ color: '#38bdf8', marginBottom: '30px', borderLeft: '4px solid #38bdf8', paddingLeft: '15px' }}>
                My Favorite Anime
            </h2>

            {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>No favorites added yet.</p>
                    <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
                        Browse Anime
                    </Link>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                    gap: '25px' 
                }}>
                    {favorites.map((fav) => (
                        <div key={fav._id} className="anime-card"> 
                            {fav.anime && (
                                <>
                                    <img 
                                        src={`http://localhost:8888/${fav.anime.image}`} 
                                        alt={fav.anime.name} 
                                        style={{ 
                                            width: '100%', 
                                            height: '320px', 
                                            objectFit: 'cover'
                                        }} 
                                    />
                                    <div className="card-content"> 
                                        <div className="text-section"> 
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#38bdf8' }}>
                                                {fav.anime.name}
                                            </h4>
                                        </div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <Link 
                                                to={`/anime/${fav.anime._id}`} 
                                                style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}
                                            >
                                                View
                                            </Link>
                                            <button 
                                                onClick={() => handleRemove(fav.anime._id)}
                                                className="remove-btn-fav" 
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;