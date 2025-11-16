/**
 * Database of known French and international YouTubers
 * Maps influencer names to their YouTube channel handles/IDs
 * 
 * Format: 'Influencer Name': '@handle' or 'channelId'
 */

export const KNOWN_YOUTUBERS: Record<string, string> = {
  // Already added
  'Norman': '@NormanFaitDesVideos',
  'Bodytime': '@Bodytime',
  'Dimitri Monique': '@DimitriMonique',
  
  // Famous French YouTubers - Gaming & Entertainment
  'Squeezie': '@Squeezie',
  'Cyprien': '@Cyprien',
  'Michou': '@Michou',
  'Inoxtag': '@Inoxtag',
  'Gotaga': '@Gotaga',
  'Amixem': '@FPSCoopGameplays',
  'Joueur du Grenier': '@joueurdugrenier',
  'Wankil Studio': 'UCYGjxo5ifuhnmvhPvCc3DJQ',
  'WankilStudio': 'UCYGjxo5ifuhnmvhPvCc3DJQ',
  'Lebouseuh': '@Bouseuh',
  'Le Vrai Bouseuh': '@Bouseuh',
  'Doigby': '@Doigby',
  'Locklear': '@Locklear',
  'Domingo': '@DomingoYT',
  'Solary': '@SolaryTV',
  'Teeqzy': '@Teeqzy',
  'IbraTV': '@IbraTV',
  'Siphano': '@Siphano',
  'Mastu': '@Mastu',
  
  // Comedy & Sketches
  'McFly et Carlito': '@McFly',
  'McFly & Carlito': '@McFly',
  'Carlito': '@McFly',
  'Natoo': '@Natoo',
  'Mister V': '@MrV',
  'Pierre Croce': '@PierreCroce',
  'Norman Thavaud': '@NormanFaitDesVideos',
  'Monsieur GRrr': '@MonsieurGRrr',
  'Aurélien (Monsieur GRrr)': '@MonsieurGRrr',
  'Poisson Fecond': 'UC4ii4_aeS8iOFzsHuhJTq2w',
  'PoissonFecond': 'UC4ii4_aeS8iOFzsHuhJTq2w',
  
  // Beauty & Lifestyle
  'EnjoyPhoenix': '@EnjoyPhoenix',
  'Marie Lopez (EnjoyPhoenix)': '@EnjoyPhoenix',
  'Marie Lopez': '@EnjoyPhoenix',
  'Léna Situations': '@LenaSituations',
  'Léna Situation': '@LenaSituations',
  'Sananas': '@Sananas',
  'Sissy MUA': '@SissyMUA',
  'Emma Verde': '@EmmaVerde',
  'Coline': '@ColineOfficiel',
  'Agathe Diary': '@AgatheDiary',
  'Andy Raconte': '@AndyRaconte',
  'Noémie Makeup Touch': '@NoemieMakeupTouch',
  'ElsaMakeup': '@ElsaMakeup',
  'Elsa Makeup': '@ElsaMakeup',
  'Beauté Active': '@BeauteActive',
  'Beauteactive': '@BeauteActive',
  'Beauteactive (Caroline)': '@BeauteActive',
  'Caroline (Beauté Active)': '@BeauteActive',
  'The Doll Beauty (Maroua)': '@TheDollBeauty',
  'Naturellement Lyla': '@NaturellementLyla',
  'Océane': '@OceaneLaVie',
  
  // Science & Education
  'Science Etonnante': '@ScienceEtonnante',
  'Science étonnante': '@ScienceEtonnante',
  'David Louapre (Science Étonnante)': '@ScienceEtonnante',
  'Dirty Biology': '@DirtyBiology',
  'DirtyBiology': '@DirtyBiology',
  'Léo Grasset (Dirty Biology)': '@DirtyBiology',
  'Dr Nozman': '@DrNozman',
  'e-penser': '@e-penser',
  'Bruce Benamran (E-Penser)': '@e-penser',
  'Nota Bene': '@notabenemovies',
  'HugoDécrypte': '@Hugo',
  'HugoDecrypte': '@Hugo',
  'Linguisticae': '@Linguisticae',
  'Cyrus North': '@CyrusNorth',
  'Monsieur Phi': '@MonsieurPhi',
  'Doc Seven': '@DocSeven',
  'Charlie Danger': '@CharlieDanger',
  'Charlie Danger (Les Revues du Monde)': '@CharlieDanger',
  'Les Revues du Monde': '@CharlieDanger',
  'Balade Mentale': '@BaladeMentale',
  'Max Bird': '@MaxBird',
  'Micmaths': '@Micmaths',
  'Les Bons Profs': '@lesbonsprofs',
  'Scilabus': '@Scilabus',
  'Antoine VS Science': '@AntoineVSScience',
  'Micode': '@Micode',
  'Un Créatif': '@UnCreatif',
  'Le Monde des Langues': '@LeMondedeslangues',
  
  // Fitness & Health
  'Tibo InShape': '@TiboInShape',
  'Tibo In Shape': '@TiboInShape',
  'Juju Fitcats': '@JujuFitcats',
  'JujuFitcats': '@JujuFitcats',
  'Marine Leleu': '@MarineLeleu',
  'Marine Leuleu': '@MarineLeleu',
  'Horia': '@Horia',
  'Joyca': '@Joyca',
  
  // Cooking
  'Chef Michel Dumas': '@ChefMichelDumas',
  'Michel Dumas': '@ChefMichelDumas',
  'Herve Cuisine': '@hervecuisine',
  'Hervé Cuisine': '@hervecuisine',
  'FastGoodCuisine': '@FastGoodCuisine',
  'FastGoodCuisine (Charles Gilles-Compagnon)': '@FastGoodCuisine',
  'L\'atelier de Roxane': '@latelierderoxane',
  'Roxane (L\'atelier de Roxane)': '@latelierderoxane',
  'Nassim Sahili': '@NassimSahili',
  
  // Tech
  'Underscore_': '@Underscore_',
  'Léo Techmaker': '@LeoTechMaker',
  'Nowtech': '@Nowtech',
  'PP World': '@PPWorld',
  'Patrick-Pierre Garcia (PP World)': '@PPWorld',
  'The iCollection': '@TheiCollection',
  'TheiCollection': '@TheiCollection',
  'Jean-Baptiste Nicolet (The iCollection)': '@TheiCollection',
  'Jean-Baptiste Nicolet': '@TheiCollection',
  'TechNews&Tests': '@TechNewsTests',
  'Romain Lanéry (TechNews&Tests)': '@TechNewsTests',
  'Romain Lanéry': '@TechNewsTests',
  'Jojol': '@Jojol',
  'Johan Lelièvre (Jojol)': '@Jojol',
  'ArtBen': '@ArtBen',
  'Brandon Le Proktor': '@BrandonLeProktor',
  'Ludo Salenne': '@LudoSalenne',
  'Léo Duff': '@LeoDuff',
  'Millomaker': '@Millomaker',
  
  // Music
  'Waxx': '@Waxx',
  'Saturax': '@Saturax',
  'French Fuse': '@FrenchFuse',
  'PV Nova': '@PVNova',
  'Maskey': '@Maskey',
  'Florent Garcia': '@FlorentGarcia',
  'Franck Cotty': '@FranckCotty',
  
  // Travel & Vlog
  'French Baloo': '@FrenchBaloo',
  'Milles Voyages (Emily Thiers)': '@MillesVoyages',
  'Bruno Maltor': '@BrunoMaltor',
  'Lyly et Jay': '@LylyetJay',
  'Felckin': '@Felckin',
  
  // Other
  'Anonimal': '@Anonimal',
  'Instanonimal': '@Anonimal',
  'Rabbin des bois': '@Rabbindesbois',
  'Quentin': '@QuentinYT',
  'ExplorIA': '@ExplorIA',
  'Steven Lathoud': '@StevenLathoud',
  'Pilote': '@Pilote',
  'Léa Bordier': '@LeaBordier',
  'Esteban': '@Esteban',
  'Dimitri Ferrière': '@DimitriFerriere',
  'Yann tout court': '@Yanntoutcourt',
  'Hugoposé': '@Hugopose',
  'David Laroche': '@DavidLaroche',
  'Richaard': '@Richaard',
  'Valouzz': '@Valouzz',
  'Batzaïr': '@Batzair',
  'Dooms': '@Dooms',
  'Yann-Cj23': '@YannCj23',
  'Unchained_Off': '@UnchainedOff',
  'LeBled\'Art': '@LebledArt',
  'Le Bled\'Art': '@LebledArt',
  'GMK': '@GMK',
  'Werenoi': '@Werenoi',
  'Yassine Sdiri': '@YassineSdiri',
  
  // International
  'Rachel Accurso (Mme Rachel)': '@MsRachel',
  'Prashant Kirad': '@PrashantKirad',
  'Madan Gowri': '@MadanGowri',
};

/**
 * Alternative names/spellings for YouTubers
 * Used for fuzzy matching
 */
export const YOUTUBER_ALIASES: Record<string, string[]> = {
  '@Squeezie': ['Squeezie', 'Lucas Hauchard', 'SqueezieLive'],
  '@Cyprien': ['Cyprien', 'Cyprien Iov', 'MonsieurDream', 'Monsieur Dream'],
  '@NormanFaitDesVideos': ['Norman', 'Norman Thavaud'],
  '@Michou': ['Michou', 'Michou YT'],
  '@Inoxtag': ['Inoxtag', 'Inox'],
  '@Gotaga': ['Gotaga', 'Corentin Houssein', 'GothaGames'],
  '@TiboInShape': ['Tibo InShape', 'Tibo In Shape', 'Thibaud Delapart'],
  '@EnjoyPhoenix': ['EnjoyPhoenix', 'Marie Lopez', 'Enjoy Phoenix'],
  '@LenaSituations': ['Léna Situations', 'Lena Situations', 'Léna Mahfouf'],
  '@ScienceEtonnante': ['Science Etonnante', 'Science étonnante', 'David Louapre'],
  '@DirtyBiology': ['Dirty Biology', 'DirtyBiology', 'Léo Grasset'],
  '@McFlyetCarlito': ['McFly et Carlito', 'McFly & Carlito', 'McFly Carlito'],
  '@Natoo': ['Natoo', 'ptitenatou'],
  '@Sananas': ['Sananas', 'SananasOfficiel'],
  '@HugoDecrypte': ['HugoDécrypte', 'Hugo Décrypte', 'Hugo Decrypte'],
  '@WankilStudio': ['Wankil Studio', 'Wankil'],
  '@PoissonFecond': ['Poisson Fecond', 'Poisson Fécond'],
};

/**
 * Get YouTube handle for an influencer name
 * Supports exact match and fuzzy matching
 */
export function getYouTubeHandle(name: string): string | null {
  // Exact match
  if (KNOWN_YOUTUBERS[name]) {
    return KNOWN_YOUTUBERS[name];
  }
  
  // Case-insensitive match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(KNOWN_YOUTUBERS)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  
  // Partial match (name contains or is contained in key)
  for (const [key, value] of Object.entries(KNOWN_YOUTUBERS)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes(lowerName) || lowerName.includes(lowerKey)) {
      // Make sure it's a significant match (at least 5 characters)
      const matchLength = Math.min(lowerKey.length, lowerName.length);
      if (matchLength >= 5) {
        return value;
      }
    }
  }
  
  return null;
}
