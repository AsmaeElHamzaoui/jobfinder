// src/app/features/jobs/models/job.model.ts

export interface Job {
  name: string;
  company?: {
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
}

export interface JobsApiResponse {
  results: Job[];
  page_count: number;
  page: number;
}

export interface JobSearchParams {
  page: number;
  keyword?: string;
  location?: string;
}