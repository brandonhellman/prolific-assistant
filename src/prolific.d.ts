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
  maximum_allowed_time: number;
  name: string;
  places_taken: number;
  published_at: string;
  researcher: {
    id: string;
    name: string;
    institution: {
      name: string | null;
      logo: string | null;
      link: string;
    };
  };
  reward: number;
  study_type: 'SINGLE';
  total_available_places: number;
}

interface ProlificApiStudies {
  error: {
    additional_information: '/api/v1/errors/';
    detail: string;
    error_code: number;
    status: number;
    title: string;
  };
  meta?: {
    count: number;
  };
  results?: ProlificStudy[];
}
