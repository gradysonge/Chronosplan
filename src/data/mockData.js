export const professors = [
  { id: 'P1', code: 'EL001', name: 'Samir Elouasbi' },
  { id: 'P2', code: 'SON002', name: 'Grady Songe ' },
  { id: 'P3', code: 'DA007', name: 'David Basola' },
  { id: 'P4', code: 'LAP029', name: 'Dany Lapointe' },
  { id: 'P5', code: 'CH008', name: 'Charles Emma ' },
  { id: 'P6', code: 'TR009', name: 'Donald Trumpa' },
  // 
].map(prof => ({
  ...prof,
  avatar: `https://i.pravatar.cc/150?u=${prof.id}`,
  iconType: 'users'
}));

export const courses = [
  { code: 'MAT1234', name: 'Mathématiques discrètes', iconType: 'book', program: 1, groups: ['G010', 'G020'] },
  { code: 'INF1120', name: 'Programmation I', iconType: 'book', program: 1, groups: ['G010', 'G020'] },
  { code: 'INF2120', name: 'Programmation II', iconType: 'book', program: 1, groups: ['G010', 'G020'] },
  { code: 'INF3190', name: 'Introduction à la programmation Web', iconType: 'book', program: 1, groups: ['G010', 'G020'] },
  { code: 'INF4170', name: 'Architecture des ordinateurs', iconType: 'book', program: 1, groups: ['G010', 'G020'] },
  { code: 'INF2010', name: 'Introduction aux réseaux', iconType: 'book', program: 2, groups: ['G010', 'G020'] },
  { code: 'INF2020', name: 'Protocoles réseau', iconType: 'book', program: 2, groups: ['G010', 'G020'] },
  { code: 'INF3010', name: 'Sécurité informatique', iconType: 'book', program: 2, groups: ['G010', 'G020'] },
  { code: 'INF3020', name: 'Cryptographie', iconType: 'book', program: 2, groups: ['G010', 'G020'] },
];

export const courseModes = [
  { id: 'online', name: 'En ligne', icon: '🌐' },
  { id: 'inPerson', name: 'Présentiel', icon: '🏛️' }
];

export const steps = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Étape ${i + 1}`,
  iconType: 'graduation'
}));

export const tokens = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  name: `${i + 1} heure${i > 0 ? 's' : ''}`,
  iconType: 'clock'
}));

export const programs = [
  { id: 1, name: 'Programmation' },
  { id: 2, name: 'Génie Informatique' },
];