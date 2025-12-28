import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';
import AdminDashboard from './pages/AdminDashboard';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import logo from "./assets/logo.jpg";
function App() {
  const { user, logout } = useContext(AuthContext); 
  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>ANIME_HUB</Link>
          <Link to="/">Explore</Link>
          {user && <Link to="/favorites">Favorites</Link>}
        </div>

        
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" style={{ color: 'var(--star)' }}>Admin</Link>}
              <Link to="/profile" style={{ fontWeight: 'bold' }}>Hi, {user.username}</Link>
              <button onClick={logout} className="btn-outline" >Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '5px', color: '#000', textDecoration: 'none' }}>Join</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
       
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

       
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/anime/:id" element={
          <ProtectedRoute>
            <AnimeDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/favorites" element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

       
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;