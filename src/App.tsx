import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Register from './Register';
import Login from './Login';
import CompleteProfile from './CompleteProfile';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  // Mock auth state for demonstration
  const [user, setUser] = useState<{ isProfileComplete: boolean } | null>(null);

  return (
    <>
      <Router>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setUser((user) => ({ isProfileComplete: !user?.isProfileComplete }))}>
            Toggle Profile Complete (current: {user?.isProfileComplete ? 'true' : 'false'})
          </button>
        </div>
        <Routes>
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/complete-profile"
            element={
              user && !user.isProfileComplete ? (
                <CompleteProfile setUser={setUser} />
              ) : (
                <Navigate to={user ? '/' : '/login'} />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                user.isProfileComplete ? (
                  <div>Home Page (Profile Complete)</div>
                ) : (
                  <Navigate to="/complete-profile" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
