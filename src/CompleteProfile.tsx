import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CompleteProfileProps {
  setUser: (user: { isProfileComplete: boolean }) => void;
}

const filieres = ['WMD', 'DATA AI', 'API', 'CCSN'];
const niveaux = [1, 2, 3, 4, 5];
const competences = [
  'React',
  'Python',
  'SQL',
  'Node.js',
  'FastAPI',
  'Machine Learning',
];
const competenceNiveaux = ['débutant', 'intermédiaire', 'avancé'];
const centresInteret = ['foot', 'basket', 'échecs', 'cinéma', 'musique'];

export default function CompleteProfile({ setUser }: CompleteProfileProps) {
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState<number | ''>('');
  const [selectedCompetences, setSelectedCompetences] = useState<{
    [key: string]: string;
  }>({});
  const [selectedCentres, setSelectedCentres] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleCompetenceChange = (comp: string, level: string) => {
    setSelectedCompetences((prev) => ({ ...prev, [comp]: level }));
  };

  const handleCentreChange = (centre: string) => {
    setSelectedCentres((prev) =>
      prev.includes(centre)
        ? prev.filter((c) => c !== centre)
        : [...prev, centre]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate profile completion
    setUser({ isProfileComplete: true });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Complétez votre profil</h2>
      <div>
        <label>Filière</label>
        <select value={filiere} onChange={e => setFiliere(e.target.value)} required>
          <option value="">Choisir...</option>
          {filieres.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label>Niveau</label>
        <select value={niveau} onChange={e => setNiveau(Number(e.target.value))} required>
          <option value="">Choisir...</option>
          {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div>
        <label>Compétences</label>
        {competences.map(comp => (
          <div key={comp} style={{ marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={comp in selectedCompetences}
              onChange={e =>
                handleCompetenceChange(
                  comp,
                  e.target.checked ? competenceNiveaux[0] : ''
                )
              }
            />
            {comp}
            {comp in selectedCompetences && selectedCompetences[comp] && (
              <select
                value={selectedCompetences[comp]}
                onChange={e => handleCompetenceChange(comp, e.target.value)}
                style={{ marginLeft: 8 }}
              >
                {competenceNiveaux.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <div>
        <label>Centres d'intérêt</label>
        {centresInteret.map(centre => (
          <div key={centre}>
            <input
              type="checkbox"
              checked={selectedCentres.includes(centre)}
              onChange={() => handleCentreChange(centre)}
            />
            {centre}
          </div>
        ))}
      </div>
      <button type="submit">Valider le profil</button>
    </form>
  );
}
