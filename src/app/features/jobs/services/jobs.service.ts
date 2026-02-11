// src/app/features/jobs/services/jobs.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap, of } from 'rxjs';
import { Job, JobsApiResponse, JobSearchParams } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/jobs';

  /**
   * Récupère les offres d'emploi depuis l'API
   */
  getJobs(searchParams: JobSearchParams): Observable<JobsApiResponse> {
    console.log('🟡 JobsService - getJobs appelé avec:', searchParams);

    let params = new HttpParams()
      .set('page', searchParams.page.toString());

    if (searchParams.keyword?.trim()) {
      params = params.set('search', searchParams.keyword.trim());
    }

    if (searchParams.location?.trim()) {
      params = params.set('location', searchParams.location.trim());
    }

    console.log('🟡 Params HTTP:', params.toString());

    return this.http.get<JobsApiResponse>(this.API_URL, { params }).pipe(
      tap(response => {
        console.log('✅ Réponse API reçue:', response);
        console.log('✅ Nombre de résultats:', response.results?.length || 0);
      }),
      map(response => ({
        results: response.results ?? [],
        page_count: response.page_count ?? 1,
        page: response.page ?? 1
      })),
      catchError(error => {
        console.error('❌ Erreur API jobs:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        
        // Retourner une réponse vide en cas d'erreur
        return of({
          results: [],
          page_count: 1,
          page: 1
        });
      })
    );
  }

  /**
   * Filtre les jobs par mot-clé dans le titre
   */
  filterJobsByKeyword(jobs: Job[], keyword: string): Job[] {
    if (!keyword?.trim()) {
      return jobs;
    }

    const filtered = jobs.filter(job =>
      job.name?.toLowerCase().includes(keyword.toLowerCase())
    );

    console.log(`✅ Jobs filtrés par keyword "${keyword}":`, filtered.length);
    return filtered;
  }

  /**
   * Trie les jobs par date de publication (plus récent en premier)
   */
  sortJobsByDate(jobs: Job[]): Job[] {
    return jobs.sort((a, b) =>
      new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime()
    );
  }
}