interface ProlificStudy {
  average_completion_time: number;
  average_reward_per_hour: number;
  date_created: string;
  description: string;
  estimated_completion_time: number;
  estimated_reward_per_hour: number;
  id: string;
  is_desktop_compatible: boolean;
  is_mobile_compatible: boolean;
  is_tablet_compatible: boolean;
  maximum_allowed_time: 14;
  name: string;
  places_taken: number;
  published_at: string;
  researcher: {
    id: string;
    name: string;
    institution: {
      name: null;
      logo: null;
      link: string;
    };
  };
  reward: number;
  study_type: 'SINGLE';
  total_available_places: number;
}

interface ProlificApiStudies {
  meta: {
    count: number;
  };
  results: ProlificStudy[];
}
