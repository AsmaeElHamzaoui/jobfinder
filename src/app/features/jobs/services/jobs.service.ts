// src/app/features/jobs/services/jobs.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap, of } from 'rxjs';
import { Job, JobsApiResponse, JobSearchParams } from '../models/job.model';
import { ApplicationsService } from '../../applications/services/applications.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/jobs';
  private readonly DEFAULT_PAGE_SIZE = 10;
  private applicationsService = inject(ApplicationsService);
  /**
   * Récupère les offres d'emploi depuis l'API
   */
  getJobs(searchParams: JobSearchParams): Observable<JobsApiResponse> {
    console.log('🟡 JobsService - getJobs appelé avec:', searchParams);

    let params = new HttpParams()
      .set('page', searchParams.page.toString())
      .set('page_size', (searchParams.pageSize || this.DEFAULT_PAGE_SIZE).toString());

    if (searchParams.keyword?.trim()) {
      params = params.set('search', searchParams.keyword.trim());
    }

    if (searchParams.location?.trim()) {
      params = params.set('location', searchParams.location.trim());
    }

    if (searchParams.level?.trim()) {
      params = params.set('level', searchParams.level.trim());
    }

    if (searchParams.category?.trim()) {
      params = params.set('category', searchParams.category.trim());
    }

    console.log('🟡 Params HTTP:', params.toString());

    return this.http.get<JobsApiResponse>(this.API_URL, { params }).pipe(
      tap(response => {
        console.log('✅ Réponse API reçue:', response);
        console.log('✅ Nombre de résultats:', response.results?.length || 0);
        console.log('✅ Total pages:', response.page_count);
      }),
      map(response => ({
        results: response.results ?? [],
        page_count: response.page_count ?? 1,
        page: response.page ?? 1,
        total: response.total
      })),
      catchError(error => {
        console.error('❌ Erreur API jobs:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        
        return of({
          results: [],
          page_count: 1,
          page: 1
        });
      })
    );
  }

  /**
   * Filtre les jobs par mot-clé UNIQUEMENT dans le titre
   * (Exigence métier: pas dans la description)
   */
  filterJobsByKeyword(jobs: Job[], keyword: string): Job[] {
    if (!keyword?.trim()) {
      return jobs;
    }

    const lowerKeyword = keyword.toLowerCase();
    const filtered = jobs.filter(job =>
      job.name?.toLowerCase().includes(lowerKeyword)
    );

    console.log(`✅ Filtrage par titre uniquement - Keyword: "${keyword}"`);
    console.log(`✅ Jobs trouvés: ${filtered.length} / ${jobs.length}`);
    return filtered;
  }

  /**
   * Trie les jobs par date de publication (plus récent en premier)
   * (Exigence métier obligatoire)
   */
  sortJobsByDate(jobs: Job[]): Job[] {
    const sorted = [...jobs].sort((a, b) => {
      const dateA = new Date(a.publication_date).getTime();
      const dateB = new Date(b.publication_date).getTime();
      return dateB - dateA; // Du plus récent au plus ancien
    });

    console.log('✅ Jobs triés par date (plus récent → plus ancien)');
    return sorted;
  }

  /**
   * Limite les résultats à 10 par page
   */
  paginateJobs(jobs: Job[], pageSize: number = this.DEFAULT_PAGE_SIZE): Job[] {
    return jobs.slice(0, pageSize);
  }

  getApplicationsService(): ApplicationsService {
  return this.applicationsService;
}

}