// src/app/features/jobs/models/job.model.ts

export interface Job {
  id?: string;
  name: string;
  company?: {
    id?: number;
    name: string;
  };
  locations?: {
    name: string;
  }[];
  publication_date: string;
  contents: string;
  refs: {
    landing_page: string;
  };
  levels?: {
    name: string;
    short_name: string;
  }[];
  categories?: {
    name: string;
  }[];
  // Champs additionnels disponibles dans l'API
  type?: string;
  model_type?: string;
  short_name?: string;
}

export interface JobsApiResponse {
  results: Job[];
  page_count: number;
  page: number;
  total?: number;
}

export interface JobSearchParams {
  page: number;
  pageSize?: number;
  keyword?: string;
  location?: string;
  level?: string;
  category?: string;
}