// 
export const professeurs = [ 
  { id: 'P1', code: '27123', nom: 'Samir Elouasbi' },
  { id: 'P2', code: '43553', nom: 'Grady Songe' },
  { id: 'P3', code: '46864', nom: 'David Basola' },
  { id: 'P4', code: '85832', nom: 'Charles Emma' },
  { id: 'P5', code: '68322', nom: 'Donald trump' },
  { id: 'P6', code: '18633', nom: 'Dany lapointe' },
  // ... on va rajouter plus atrd 6 je toruves c bon
].map(prof => ({
  ...prof,
  avatar: `https://i.pravatar.cc/150?u=${prof.id}`,
  typeIcone: 'users'
}));

export const cours = [
  { code: '1234', nom: 'Mathématique', typeIcone: 'book', groupes: ['G010', 'G020'] },
  { code: '1120', nom: 'Programmation I', typeIcone: 'book', groupes: ['G010', 'G020'] },
  { code: '2120', nom: 'Intelligence Artificiel', typeIcone: 'book', groupes: ['G010', 'G020'] },
  { code: '3190', nom: 'Introduction Infonuagique ', typeIcone: 'book', groupes: ['G010', 'G020'] },
  { code: '4170', nom: 'Base de données massive', typeIcone: 'book', groupes: ['G010', 'G020'] },
];

export const modesEnseignement = [
  { id: 'online', nom: 'En ligne', icone: '🌐' },
  { id: 'inPerson', nom: 'Présentiel', icone: '🏛️' }
];

export const etapes = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  nom: `Étape ${i + 1}`,
  typeIcone: 'graduation'
}));

export const durees = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  nom: `${i + 1} heure${i > 0 ? 's' : ''}`,
  typeIcone: 'clock'
}));

export const programmes = [
  { id: 1, nom: 'Programmation' },
  { id: 2, nom: 'Génie Informatique' },
];