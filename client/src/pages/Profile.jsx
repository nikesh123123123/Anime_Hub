import React, { useEffect, useState } from 'react';
import API from '../api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/user/me');
                setProfile(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile", err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 5%', maxWidth: '800px', margin: 'auto' }}>
            
            <div className="comment-box" style={{ 
                textAlign: 'center', 
                borderLeft: 'none', 
                borderTop: '4px solid var(--primary)' 
            }}>
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    background: 'var(--primary)', 
                    borderRadius: '50%', 
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: '#000',
                    fontWeight: 'bold'
                }}>
                    {profile?.username?.charAt(0).toUpperCase()}
                </div>
                <h1>{profile?.username}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{profile?.emailid}</p>
                
                <span style={{ 
                    background: 'var(--glass)', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    color: profile?.role === 'admin' ? 'var(--star)' : 'white' 
                }}>
                    {profile?.role?.toUpperCase()}
                </span>
            </div>

           
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="comment-box" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Activity</h2> 
                    <p style={{ color: 'var(--text-muted)' }}>Check your favorites and likes in the menu.</p>
                </div>
                
                <div className="comment-box" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--accent)' }}>Settings</h2> 
                    <button className="btn-outline" style={{ width: '100%' }}>Update Password</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;