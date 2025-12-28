// import React, { useState } from 'react';
// import API from '../api';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         emailid: '',
//         password: ''
//     });
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await API.post('/user/register', formData);
//             alert("Registration Successful! Please login.");
//             navigate('/login');
//         } catch (err) {
//             setError(err.response?.data?.message || "Registration failed");
//         }
//     };

//     return (
//         <div style={{ maxWidth: '400px', margin: '50px auto' }}>
//             <h2>Create Account</h2>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <form onSubmit={handleSubmit}>
//                 <input 
//                     type="text" 
//                     placeholder="Username"
//                     value={formData.username}
//                     onChange={(e) => setFormData({...formData, username: e.target.value})}
//                     style={{ display: 'block', width: '100%', marginBottom: '10px' }}
//                     required
//                 />
//                 <input 
//                     type="email" 
//                     placeholder="Email Address"
//                     value={formData.emailid}
//                     onChange={(e) => setFormData({...formData, emailid: e.target.value})}
//                     style={{ display: 'block', width: '100%', marginBottom: '10px' }}
//                     required
//                 />
//                 <input 
//                     type="password" 
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                     style={{ display: 'block', width: '100%', marginBottom: '10px' }}
//                     required
//                 />
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// };

// export default Register;
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        emailid: '',
        password: ''
    });
    
    // --- TOAST STATE ---
    const [toast, setToast] = useState({ show: false, message: "" });
    const navigate = useNavigate();

    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/user/register', formData);
            
            // Show success toast
            showToast("Registration Successful! 🎉");
            
            // Small delay so the user can see the toast before navigating
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            // Pull specific message from backend (e.g., "Email already in use")
            const errorMsg = err.response?.data?.message || "Registration failed";
            showToast(errorMsg);
        }
    };

    return (
        <div className="comment-box" style={{ maxWidth: '400px', margin: '100px auto' }}>
            {/* Animated Toast Component */}
            {toast.show && (
                <div className="toast-container">
                    {toast.message}
                </div>
            )}

            <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Create Account</h2>
            
            <form onSubmit={handleSubmit}>
                <input 
                    className="action-btn-main blue-glow-hover"
                    type="text" 
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    style={inputStyle}
                    required
                />
                <input 
                    className="action-btn-main blue-glow-hover"
                    type="email" 
                    placeholder="Email Address"
                    value={formData.emailid}
                    onChange={(e) => setFormData({...formData, emailid: e.target.value})}
                    style={inputStyle}
                    required
                />
                <input 
                    className="action-btn-main blue-glow-hover"
                    type="password" 
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={inputStyle}
                    required
                />
                <button type="submit" className="action-btn-main blue-glow-hove" style={{ width: '100%', marginTop: '10px' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

const inputStyle = { display: 'block', width: '100%', marginBottom: '15px', padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '5px' };

export default Register;