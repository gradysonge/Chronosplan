export const professors = [
  { id: 'P1', code: 'EL001', name: 'Samir Elouasbi' },
  { id: 'P2', code: 'SON002', name: 'Grady Songe ' },
  { id: 'P3', code: 'DA007', name: 'David Basola' },
  { id: 'P1', code: 'LAP029', name: 'Dany Lapointe' },
  { id: 'P2', code: 'CH008', name: 'Charles Emma ' },
  { id: 'P3', code: 'TR009', name: 'Donald Trumpa' },
  // 
].map(prof => ({
  ...prof,
  avatar: `https://i.pravatar.cc/150?u=${prof.id}`
}));

export const courses = [
  { code: 'MAT1234', name: 'Mathématiques ' },
  { code: 'INF1120', name: 'Programmation I' },
  { code: 'INF2120', name: 'Programmation II' },
  { code: 'INF3190', name: 'Introduction à la programmation Web' },
  { code: 'INF4170', name: 'Architecture des ordinateurs' },
];

export const courseModes = [
  { id: 'online', name: 'En ligne', icon: '🌐' },
  { id: 'inPerson', name: 'Présentiel', icon: '🏛️' }
];

export const steps = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Étape ${i + 1}`
}));