// 
export const professeurs = [ 
  { id: 'P1', code: '', nom: 'Louis-Philippe Jolivette' },
  { id: 'P2', code: '', nom: 'Madjid Hamadi' },
  { id: 'P3', code: '', nom: 'Robert-Nikola Filiou' },
  { id: 'P4', code: '', nom: 'Rodrigue Kemgang Teikeu' },
  { id: 'P5', code: '', nom: 'Samir Elouasbi' },
  { id: 'P6', code: '', nom: 'Sébastien Bois' },
  { id: 'P7', code: '', nom: 'Wadii Hajji' },
  { id: 'P8', code: '', nom: 'Dany Lapointe' },
  { id: 'P9', code: '', nom: 'Gil Audrey Nangue Tsotsop' },
  { id: 'P10', code: '', nom: 'Haithem Haggui' },
  { id: 'P11', code: '', nom: 'Manel Sorba' },
  { id: 'P12', code: '', nom: 'Martin Charbonneau' },
  { id: 'P13', code: '', nom: 'Mathieu Robson' },
  { id: 'P14', code: '', nom: 'Mohammed Amellah' },
  { id: 'P15', code: '', nom: 'Pierre-Olivier Bachand' },
  { id: 'P16', code: '', nom: 'Rabeb Saad' },
  { id: 'P17', code: '', nom: 'Souaad Lahlah' },
  { id: 'P18', code: '', nom: 'Joel Muteba' },
  { id: 'P19', code: '', nom: 'Serge Daigle' },
  { id: 'P20', code: '', nom: 'Afef Ben Zine El Abidine' },
  { id: 'P21', code: '', nom: 'Fatma Assida' },
  { id: 'P22', code: '', nom: 'Faycel Jaouadi' },
  { id: 'P23', code: '', nom: 'Jamil Dimassi' },
  { id: 'P24', code: '', nom: 'Mohamed Salah Bouhlel' },
  { id: 'P25', code: '', nom: 'Romaissaa Mazouni' },
  { id: 'P26', code: '', nom: 'Yassine Benfares' },
  { id: 'P27', code: '', nom: 'Abdelkader Rais' },
  { id: 'P28', code: '', nom: 'Abderrrahmane Ben Mimoune' },
  { id: 'P29', code: '', nom: 'Alain Loua' },
  { id: 'P30', code: '', nom: 'Laudi El Hajjar' },
  { id: 'P31', code: '', nom: 'Lorraine Lapointe' },
  { id: 'P32', code: '', nom: 'Luis Carlos Saldarriaga' },
  { id: 'P33', code: '', nom: 'Marco Lavoie' },
  { id: 'P34', code: '', nom: 'Mohammed Ramzi Naouali' },
  { id: 'P35', code: '', nom: 'Mounir Katet' },
  { id: 'P36', code: '', nom: 'Mountassir Harriri' },
  { id: 'P37', code: '', nom: 'Anis Ben Omrane' },
  { id: 'P38', code: '', nom: 'Hamza El Maadani' },
  { id: 'P39', code: '', nom: 'Jonathan Wilkie' },
  { id: 'P40', code: '', nom: 'Karim Baratli' },
  { id: 'P41', code: '', nom: 'Mostapha Zine El Adidine' },
  { id: 'P42', code: '', nom: 'Boualem Ait Ali Slimane' },
  { id: 'P43', code: '', nom: 'Adil Cherribi' },
  { id: 'P44', code: '', nom: 'Ahmed Khlifa' },
  { id: 'P45', code: '', nom: 'Bakary Diarra' },
  { id: 'P46', code: '', nom: 'Estelle Marcella Bouoda' },
  { id: 'P47', code: '', nom: 'Harold Mokem Tamo' },
  { id: 'P48', code: '', nom: 'Hind Latifi' },
  { id: 'P49', code: '', nom: 'Kodzo Michel Aladi' },
  { id: 'P50', code: '', nom: 'Laila Ait Ali' },
  { id: 'P51', code: '', nom: 'Larbi Elhajjaoui' },
  { id: 'P52', code: '', nom: 'Mouna Tebourski' },
  { id: 'P53', code: '', nom: 'Samia Djerroud' },
  { id: 'P54', code: '', nom: 'Sedric Ouambo Silatchom' },
  { id: 'P55', code: '', nom: 'Wided Oueslati' },
  { id: 'P56', code: '', nom: 'Zahia Ouadah' },
  { id: 'P57', code: '', nom: 'Asmaa Hailane' },
  { id: 'P58', code: '', nom: 'Jean-Gabriel Gaudreault' },
  { id: 'P59', code: '', nom: 'Khaled Saidani' },
  { id: 'P60', code: '', nom: 'Mohammed Yafout' }
].map(prof => ({
  ...prof,
  avatar: `https://i.pravatar.cc/150?u=${prof.id}`,
  typeIcone: 'users'
}));

export const modesEnseignement = [
  { id: 'online', nom: 'Distance', icone: '🌐' },
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
