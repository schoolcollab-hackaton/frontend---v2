// Competences by filiere
export const COMPETENCES_BY_FILIERE = {
  WMD: [
    { nom: "HTML/CSS", description: "Langages de balisage et de style pour le web" },
    { nom: "JavaScript", description: "Langage de programmation pour le web" },
    { nom: "React", description: "Bibliothèque JavaScript pour interfaces utilisateur" },
    { nom: "Vue.js", description: "Framework JavaScript progressif" },
    { nom: "Angular", description: "Framework web TypeScript" },
    { nom: "Node.js", description: "Runtime JavaScript côté serveur" },
    { nom: "PHP", description: "Langage de programmation web" },
    { nom: "WordPress", description: "Système de gestion de contenu" },
    { nom: "Figma", description: "Outil de design d'interface" },
    { nom: "Adobe Photoshop", description: "Logiciel de retouche d'images" },
    { nom: "UI/UX Design", description: "Design d'expérience utilisateur" },
    { nom: "Responsive Design", description: "Design adaptatif multi-supports" },
    { nom: "SASS/SCSS", description: "Préprocesseur CSS" },
    { nom: "Bootstrap", description: "Framework CSS" },
    { nom: "jQuery", description: "Bibliothèque JavaScript" },
    { nom: "Git", description: "Système de contrôle de version" }
  ],
  API: [
    { nom: "Java", description: "Langage de programmation orienté objet" },
    { nom: "Spring Boot", description: "Framework Java pour applications" },
    { nom: "C#", description: "Langage de programmation Microsoft" },
    { nom: ".NET", description: "Plateforme de développement Microsoft" },
    { nom: "Python", description: "Langage de programmation polyvalent" },
    { nom: "Django", description: "Framework web Python" },
    { nom: "Flask", description: "Micro-framework web Python" },
    { nom: "REST API", description: "Architecture d'API web" },
    { nom: "GraphQL", description: "Langage de requête pour API" },
    { nom: "Microservices", description: "Architecture en microservices" },
    { nom: "Docker", description: "Plateforme de conteneurisation" },
    { nom: "Kubernetes", description: "Orchestrateur de conteneurs" },
    { nom: "AWS", description: "Services cloud Amazon" },
    { nom: "Azure", description: "Services cloud Microsoft" },
    { nom: "PostgreSQL", description: "Base de données relationnelle" },
    { nom: "MySQL", description: "Système de gestion de base de données" },
    { nom: "MongoDB", description: "Base de données NoSQL" },
    { nom: "Redis", description: "Base de données en mémoire" }
  ],
  BDAI: [
    { nom: "Python", description: "Langage de programmation pour data science" },
    { nom: "R", description: "Langage statistique et analyse de données" },
    { nom: "SQL", description: "Langage de requête de bases de données" },
    { nom: "Machine Learning", description: "Apprentissage automatique" },
    { nom: "Deep Learning", description: "Apprentissage profond" },
    { nom: "TensorFlow", description: "Framework de machine learning" },
    { nom: "PyTorch", description: "Framework de deep learning" },
    { nom: "Pandas", description: "Bibliothèque Python d'analyse de données" },
    { nom: "NumPy", description: "Bibliothèque Python de calcul scientifique" },
    { nom: "Scikit-learn", description: "Bibliothèque Python de machine learning" },
    { nom: "Data Visualization", description: "Visualisation de données" },
    { nom: "Tableau", description: "Outil de visualisation de données" },
    { nom: "Power BI", description: "Outil Microsoft de business intelligence" },
    { nom: "Apache Spark", description: "Framework de traitement de données" },
    { nom: "Statistics", description: "Statistiques et probabilités" },
    { nom: "Excel", description: "Tableur Microsoft" }
  ],
  CCSN: [
    { nom: "Network Security", description: "Sécurité des réseaux" },
    { nom: "Penetration Testing", description: "Tests d'intrusion" },
    { nom: "Ethical Hacking", description: "Piratage éthique" },
    { nom: "Firewall", description: "Pare-feu de sécurité" },
    { nom: "SIEM", description: "Gestion des événements de sécurité" },
    { nom: "Incident Response", description: "Réponse aux incidents de sécurité" },
    { nom: "Risk Assessment", description: "Évaluation des risques" },
    { nom: "Compliance", description: "Conformité réglementaire" },
    { nom: "Linux", description: "Système d'exploitation Linux" },
    { nom: "Windows Server", description: "Serveur Windows" },
    { nom: "Cisco", description: "Technologies réseau Cisco" },
    { nom: "Wireshark", description: "Analyseur de protocole réseau" },
    { nom: "Nmap", description: "Scanner de réseau" },
    { nom: "Metasploit", description: "Framework de test de pénétration" }
  ]
};

// General competences (cross-filiere)
export const GENERAL_COMPETENCES = [
  { nom: "Git", description: "Système de contrôle de version" },
  { nom: "Linux", description: "Système d'exploitation open source" },
  { nom: "Windows", description: "Système d'exploitation Microsoft" },
  { nom: "Project Management", description: "Gestion de projet" },
  { nom: "Agile", description: "Méthodologie agile" },
  { nom: "Scrum", description: "Framework agile Scrum" },
  { nom: "Communication", description: "Compétences de communication" },
  { nom: "Team Leadership", description: "Leadership d'équipe" },
  { nom: "Problem Solving", description: "Résolution de problèmes" },
  { nom: "English", description: "Anglais professionnel" },
  { nom: "Presentation Skills", description: "Compétences de présentation" },
  { nom: "Documentation", description: "Rédaction de documentation" },
  { nom: "Testing", description: "Tests logiciels" },
  { nom: "Debugging", description: "Débogage de code" }
];

// All competences combined
export const ALL_COMPETENCES = [
  ...COMPETENCES_BY_FILIERE.WMD,
  ...COMPETENCES_BY_FILIERE.API,
  ...COMPETENCES_BY_FILIERE.BDAI,
  ...COMPETENCES_BY_FILIERE.CCSN,
  ...GENERAL_COMPETENCES
].sort((a, b) => a.nom.localeCompare(b.nom));

// Helper function to get competences for a specific filiere
export const getCompetencesForFiliere = (filiere: string) => {
  const filiereCompetences = COMPETENCES_BY_FILIERE[filiere as keyof typeof COMPETENCES_BY_FILIERE] || [];
  return [...filiereCompetences, ...GENERAL_COMPETENCES].sort((a, b) => a.nom.localeCompare(b.nom));
};

// Centres d'intérêt
export const CENTRES_INTERETS = [
  { titre: "Intelligence Artificielle" },
  { titre: "Développement Web" },
  { titre: "Cybersécurité" },
  { titre: "Data Science" },
  { titre: "Cloud Computing" },
  { titre: "Mobile Development" },
  { titre: "DevOps" },
  { titre: "Blockchain" },
  { titre: "IoT" },
  { titre: "Gaming" },
  { titre: "E-commerce" },
  { titre: "Fintech" },
  { titre: "Healthtech" },
  { titre: "EdTech" },
  { titre: "Startup" },
  { titre: "Innovation" },
  { titre: "Open Source" },
  { titre: "Agile" },
  { titre: "Scrum" },
  { titre: "Design Thinking" },
  { titre: "UX Research" },
  { titre: "Digital Marketing" },
  { titre: "SEO" },
  { titre: "Content Creation" },
  { titre: "Video Editing" },
  { titre: "Photography" },
  { titre: "Music Production" },
  { titre: "3D Modeling" },
  { titre: "Virtual Reality" },
  { titre: "Augmented Reality" },
  { titre: "Robotics" }
].sort((a, b) => a.titre.localeCompare(b.titre));