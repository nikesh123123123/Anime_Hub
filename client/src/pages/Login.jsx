
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ identity: '', password: '' });
    

    const [toast, setToast] = useState({ show: false, message: "" });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/user/login', formData);
            
           
            showToast("Welcome back! 👋");
            
          
            login(data.user, data.token);
            
            
            setTimeout(() => {
                navigate('/');
            }, 1200); 

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Invalid Credentials";
            showToast(errorMsg);
        }
    };

    return (
        <div className="comment-box" style={{ maxWidth: '400px', margin: '100px auto', position: 'relative' }}>
            
         
            {toast.show && (
                <div className="toast-container">
                    {toast.message}
                </div>
            )}

            <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Login</h2>
            
            <form onSubmit={handleSubmit}>
                <input 
                    className="action-btn-main blue-glow-hover"
                    type="text" 
                    placeholder="Username or Email"
                    style={inputStyle}
                    onChange={(e) => setFormData({...formData, identity: e.target.value})}
                    required
                />
                <input 
                   className="action-btn-main blue-glow-hover"
                    type="password" 
                    placeholder="Password"
                    style={inputStyle}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button type="submit" className="action-btn-main blue-glow-hover"  btn-primary blue-glow-hoverstyle={{ width: '100%', marginTop: '10px' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

const inputStyle = { display: 'block', width: '100%', marginBottom: '15px', padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '5px' };

export default Login;
