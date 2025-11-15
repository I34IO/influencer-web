export interface Translations {
  app: {
    title: string;
    subtitle: string;
  };
  dashboard: {
    title: string;
    totalInfluencers: string;
    totalFollowers: string;
    avgEngagement: string;
    topPerformers: string;
    active: string;
    acrossPlatforms: string;
    networkAverage: string;
    platinumTier: string;
    recentActivity: string;
    followers: string;
    score: string;
  };
  actions: {
    viewAllInfluencers: string;
    viewRankings: string;
    scanQR: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
  };
  language: {
    english: string;
    french: string;
  };
  loading: string;
  error: string;
}

export const translations: Record<string, Translations> = {
  en: {
    app: {
      title: 'InfluenceTracker',
      subtitle: 'Monitor and analyze influencer performance',
    },
    dashboard: {
      title: 'Dashboard',
      totalInfluencers: 'Total Influencers',
      totalFollowers: 'Total Followers',
      avgEngagement: 'Avg Engagement',
      topPerformers: 'Top Performers',
      active: 'active',
      acrossPlatforms: 'Across all platforms',
      networkAverage: 'Network average',
      platinumTier: 'Platinum tier',
      recentActivity: 'Recent Activity',
      followers: 'followers',
      score: 'score',
    },
    actions: {
      viewAllInfluencers: 'View All Influencers',
      viewRankings: 'View Rankings',
      scanQR: 'Scan QR Code',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    language: {
      english: 'English',
      french: 'Français',
    },
    loading: 'Loading...',
    error: 'Failed to load dashboard data',
  },
  fr: {
    app: {
      title: 'InfluenceTracker',
      subtitle: 'Surveillez et analysez les performances des influenceurs',
    },
    dashboard: {
      title: 'Tableau de bord',
      totalInfluencers: 'Total Influenceurs',
      totalFollowers: 'Total Abonnés',
      avgEngagement: 'Engagement Moyen',
      topPerformers: 'Meilleurs Performeurs',
      active: 'actifs',
      acrossPlatforms: 'Sur toutes les plateformes',
      networkAverage: 'Moyenne du réseau',
      platinumTier: 'Niveau platine',
      recentActivity: 'Activité Récente',
      followers: 'abonnés',
      score: 'score',
    },
    actions: {
      viewAllInfluencers: 'Voir Tous les Influenceurs',
      viewRankings: 'Voir les Classements',
      scanQR: 'Scanner le Code QR',
    },
    theme: {
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
    },
    language: {
      english: 'English',
      french: 'Français',
    },
    loading: 'Chargement...',
    error: 'Échec du chargement des données du tableau de bord',
  },
};

export type Language = keyof typeof translations;
