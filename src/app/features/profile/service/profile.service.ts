// src/app/features/profile/services/profile.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  updateProfile(userId: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, data);
  }

  verifyPassword(userId: number, password: string): Observable<boolean> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`)
      .pipe(
        map(user => user.password === password)
      );
  }

  updatePassword(userId: number, newPassword: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, { password: newPassword });
  }

  deleteAccount(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}