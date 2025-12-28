
import React, { useState, useEffect } from 'react';
import API from '../api';

const AdminDashboard = () => {
    const [animes, setAnimes] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', genre: '' });
    const [image, setImage] = useState(null);
    
   
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    
  
    const [toast, setToast] = useState({ show: false, message: "" });

    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const fetchAnimes = async () => {
        try {
            const { data } = await API.get('/anime');
            setAnimes(data.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAnimes(); }, []);

  
    const startEdit = (anime) => {
        setIsEditing(true);
        setEditId(anime._id);
        setFormData({
            name: anime.name,
            description: anime.description,
            genre: anime.genre.join(', ') 
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: '', description: '', genre: '' });
        setImage(null);
    };

  
    const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('genre', formData.genre);
    if (image) data.append('image', image);

    try {
        if (isEditing) {
            await API.put(`/anime/${editId}`, data);
            showToast("Anime updated successfully! 🔄");
        } else {
           
            const response = await API.post('/anime', data);

           
            if (response.data.success) {
                showToast("Anime added successfully! ✨");
            }
        }
        
        
        cancelEdit();
        fetchAnimes(); 

    } catch (err) {
       
        const errorMessage = err.response?.data?.message || "Error processing request";
        showToast(errorMessage);
        
       
    }
};

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await API.delete(`/anime/${id}`);
                showToast("Anime deleted successfully 🗑️");
                fetchAnimes();
            } catch (err) {
                showToast("Failed to delete anime");
            }
        }
    };

    const inputStyle = { display: 'block', width: '100%', marginBottom: '10px', padding: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px' };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', color: 'white' }}>
            
            {toast.show && <div className="toast-container">{toast.message}</div>}

           
            <div style={{ width: '250px', background: 'var(--card-bg)', borderRight: '1px solid var(--glass)', padding: '2rem 1rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Admin Tools</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '1.5rem' }}>
                        <a href="#add" onClick={cancelEdit} style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>➕</span> Add Anime
                        </a>
                    </li>
                    <li style={{ marginBottom: '1.5rem' }}>
                        <a href="#manage" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>⚙️</span> Manage List
                        </a>
                    </li>
                </ul>
            </div>

            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                
                <section id="add" style={{ marginBottom: '4rem' }}>
                    <h2 style={{ color: isEditing ? '#fbbf24' : 'var(--primary)' }}>
                        {isEditing ? "Edit Anime Mode" : "Add New Anime"}
                    </h2>
                    
                    <form onSubmit={handleSubmit} style={{ background: 'var(--glass)', padding: '25px', borderRadius: '12px', border: isEditing ? '1px solid #fbbf24' : '1px solid var(--glass)' }}>
                        <input type="text" placeholder="Anime Name" value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
                        
                        <textarea placeholder="Description" value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{...inputStyle, height: '100px'}} />

                        <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#38bdf8' }}>Genres (Comma separated):</p>
                        <input type="text" placeholder="e.g. Action, Drama" value={formData.genre} 
                            onChange={(e) => setFormData({...formData, genre: e.target.value})} required style={inputStyle} />
                        
                        <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#38bdf8' }}>
                            {isEditing ? "Upload new image (optional):" : "Anime Image:"}
                        </p>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} required={!isEditing} style={{...inputStyle, background: 'transparent', border: 'none'}} />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1, marginTop: '10px', background: isEditing ? '#fbbf24' : 'var(--primary)', color: isEditing ? '#000' : '' }}>
                                {isEditing ? "Update Anime Details" : "Upload Anime"}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={cancelEdit} className="btn-outline" style={{ flex: 0.5, marginTop: '10px' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid var(--glass)', margin: '3rem 0' }} />

                <section id="manage">
                    <h3 style={{ marginBottom: '20px' , color: "#38bdf8"}}>Existing Anime Database</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {animes.map(a => (
                            <div key={a._id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                background: 'var(--glass)', 
                                padding: '15px', 
                                borderRadius: '8px',
                                border: editId === a._id ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div>
                                    <strong style={{ fontSize: '1.1rem' ,color: "#38bdf8"}}>{a.name}</strong>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {a.genre.join(' • ')}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => startEdit(a)} 
                                        style={{ border: 'none', background: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(a._id)} 
                                        style={{ border: 'none', background: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;