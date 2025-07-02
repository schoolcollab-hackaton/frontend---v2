import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
}

export default function Register({ setUser }: RegisterProps) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration and login
    setUser({ isProfileComplete: false });
    navigate('/complete-profile');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Register</h2>
      <div>
        <label>First Name</label>
        <input value={firstname} onChange={e => setFirstname(e.target.value)} required />
      </div>
      <div>
        <label>Last Name</label>
        <input value={lastname} onChange={e => setLastname(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
