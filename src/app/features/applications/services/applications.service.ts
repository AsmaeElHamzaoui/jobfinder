import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application } from '../models/application.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/applications';

  getUserApplications(userId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.api}?userId=${userId}`);
  }

  addApplication(app: Application): Observable<Application> {
    return this.http.post<Application>(this.api, app);
  }

  updateApplication(id: string, data: Partial<Application>) {
    return this.http.patch(`${this.api}/${id}`, data);
  }

  deleteApplication(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }

  alreadyApplied(userId: string, offerId: string) {
    return this.http.get<Application[]>(
      `${this.api}?userId=${userId}&offerId=${offerId}`
    );
  }
}
