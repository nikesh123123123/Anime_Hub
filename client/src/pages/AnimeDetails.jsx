
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const AnimeDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [anime, setAnime] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ show: false, message: "" });

    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const sortComments = (commentList) => {
        if (!commentList) return [];
        return [...commentList].sort((a, b) => {
            if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    };

    const fetchData = async () => {
        try {
            const animeRes = await API.get(`/anime/${id}`);
            const commentRes = await API.get(`/comments/${id}`);
            
            setAnime(animeRes.data.data);
            setComments(sortComments(commentRes.data));
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) fetchData(); }, [id]);

    const handleLike = async () => {
        try {
            const { data } = await API.post(`/likes/${id}`);
            setAnime({ ...anime, isLiked: data.liked, likesCount: data.currentLikes });
            showToast(data.liked ? "Added to Liked ❤️" : "Removed from Liked");

            const refreshRes = await API.get(`/anime/${id}`);
            setAnime(refreshRes.data.data);
        } catch (err) { showToast("Login to like!"); }
    };

    const handleFavorite = async () => {
        try {
            if (anime.isFavorited) {
                await API.delete(`/fav/${id}`);
                setAnime({ ...anime, isFavorited: false });
                showToast("Removed from Favorites 🗑️");
            } else {
                await API.post(`/fav/${id}`);
                setAnime({ ...anime, isFavorited: true });
                showToast("Added to Favorites ⭐");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error updating favorites";
            showToast(errorMessage);
        }
    };

    
    const handleRate = async (score) => {
        try {
            const { data } = await API.post(`/ratings/${id}/rate`, { score });
            setAnime({ 
                ...anime, 
                ratingInfo: { 
                    ...anime.ratingInfo, 
                    averageRating: data.averageRating,
                    totalVotes: data.totalVotes
                } 
            });
            showToast(`Rated ${score} stars! ⭐`);
        } catch (err) {
            showToast(err.response?.data?.message || "Login to rate!");
        }
    };

    const handleTogglePin = async (commentId) => {
        try {
            const { data } = await API.patch(`/comments/${commentId}/pin`);
            const updated = comments.map(c => c._id === commentId ? { ...c, isPinned: data.isPinned } : c);
            setComments(sortComments(updated));
            showToast(data.isPinned ? "Comment Pinned 📌" : "Comment Unpinned");
        } catch (err) { showToast("Admin permissions required"); }
    };

    const handleUpdateComment = async (commentId) => {
        try {
            const { data } = await API.put(`/comments/${commentId}`, { text: editText });
            setComments(comments.map(c => c._id === commentId ? { ...c, text: data.text } : c));
            setEditingCommentId(null);
            showToast("Comment updated successfully!");
        } catch (err) { showToast("Failed to update comment"); }
    };

    const postComment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/comments', { text: newComment, animeId: id });
            const newCommentWithUser = { ...data, user: { _id: user?._id || user?.id, username: user?.username } };
            setComments(sortComments([newCommentWithUser, ...comments]));
            setNewComment("");
            showToast("Comment posted! 💬");
        } catch (err) { showToast("Login to comment"); }
    };

    const deleteComment = async (commentId) => {
        if (window.confirm("Delete this comment permanently?")) {
            try {
                await API.delete(`/comments/${commentId}`);
                setComments(comments.filter(c => c._id !== commentId));
                showToast("Comment deleted 🗑️");
            } catch (err) { showToast("Could not delete comment"); }
        }
    };

    if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', color: '#fff' }}>
            
            {toast.show && (
                <div className="toast-container">
                    {toast.message}
                </div>
            )}

            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                <img src={`http://localhost:8888/${anime.image}`} alt={anime.name} style={{ width: '250px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #334155' }} />
                
                <div style={{ flex: 1 }}>
                    <h1 style={{ color: '#38bdf8', fontSize: '2.5rem', textTransform: 'capitalize', marginBottom: '10px' }}>
                        {anime.name}
                    </h1>

                   
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <span style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            ★ {anime.ratingInfo?.averageRating || "0.0"}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            ({anime.ratingInfo?.totalVotes || 0} votes)
                        </span>
                    </div>
                  
                    <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '25px' }}>{anime.description}</p>
                    
                  
                    <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '25px' }} className="blue-glow-hover">
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 'bold' }}>RATE THIS ANIME</p>
                        <StarRating 
                            initialRating={0} 
                            onRate={handleRate} 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={handleLike} className="action-btn-main blue-glow-hover">
                            {anime.isLiked ? '❤️' : '🤍'} Like ({anime.likesCount || 0})
                        </button>
                        <button onClick={handleFavorite} className="action-btn-main blue-glow-hover">
                            {anime.isFavorited ? '⭐' : '☆'} Favorite
                        </button>
                    </div>

                    {anime.recentLikers && anime.recentLikers.length > 0 && (
                        <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#64748b' }}>
                            Liked by: {anime.recentLikers.slice(0, 3).map((l, index) => (
                                <span key={index}>
                                    {l.user?.username}{index < Math.min(anime.recentLikers.length, 3) - 1 ? ', ' : ''}
                                </span>
                            ))}
                            {anime.recentLikers.length > 3 && " and others"}
                        </div>
                    )}
                </div>
            </div>

            <hr style={{ borderColor: '#334155', margin: '3rem 0' }} />

            <div style={{ marginTop: '30px' }}>
                <h3  style={{ marginBottom: '20px' , color: '#38bdf8'} }>Comments ({comments.length})</h3>
                <form onSubmit={postComment} style={{ marginBottom: '30px' }}>
                    <textarea 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Join the discussion..."
                        className="filter-input blue-glow-hover"
                        style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}
                        required
                    />
                    <button type="submit"style={{backgroundColor: '#38bdf8' }}>Post Comment</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {comments.map((c) => (
                        <div key={c._id} style={{ 
                            padding: '15px', 
                            background: c.isPinned ? 'rgba(56, 189, 248, 0.1)' : '#1e293b', 
                            borderRadius: '12px', 
                            border: c.isPinned ? '1px solid #38bdf8' : '1px solid #334155' 
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ color: c.isPinned ? '#38bdf8' : '#38bdf8' }}>
                                    {c.user?.username || "User"} {c.isPinned && "📌"}
                                </strong>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {user?.role === 'admin' && <button onClick={() => handleTogglePin(c._id)} style={actionBtnStyle}>{c.isPinned ? 'Unpin' : 'Pin'}</button>}
                                    {(user?._id === c.user?._id || user?.id === c.user?._id) && <button onClick={() => { setEditingCommentId(c._id); setEditText(c.text); }} style={{ ...actionBtnStyle, color: '#fbbf24' }}>Edit</button>}
                                    {(user?._id === c.user?._id || user?.id === c.user?._id || user?.role === 'admin') && <button onClick={() => deleteComment(c._id)} style={{ ...actionBtnStyle, color: '#f43f5e' }}>Delete</button>}
                                </div>
                            </div>

                            {editingCommentId === c._id ? (
                                <div style={{ marginTop: '10px' }}>
                                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="filter-input" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleUpdateComment(c._id)} className="btn-primary" style={{ padding: '6px 15px', fontSize: '13px' }}>Save</button>
                                        <button onClick={() => setEditingCommentId(null)} className="btn-outline" style={{ padding: '6px 15px', fontSize: '13px' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ margin: '12px 0', color: 'white', lineHeight: '1.5' }}>{c.text}</p>
                            )}
                            <small style={{ color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ height: '100px' }}></div>
        </div>
    );
};

const actionBtnStyle = { border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#38bdf8', transition: 'opacity 0.2s' };

export default AnimeDetails;