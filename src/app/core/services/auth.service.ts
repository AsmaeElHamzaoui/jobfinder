// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private STORAGE_KEY = 'currentUser';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(users => {
          console.log('Réponse API:', users); // Debug
          
          if (users && users.length > 0) {
            const { password: _, ...safeUser } = users[0];
            
            // Stocker dans localStorage
            try {
              localStorage.setItem(this.STORAGE_KEY, JSON.stringify(safeUser));
              console.log('User stocké:', localStorage.getItem(this.STORAGE_KEY)); // Debug
            } catch (e) {
              console.error('Erreur localStorage:', e);
            }
            
            return safeUser as User;
          }
          return null;
        }),
        catchError(error => {
          console.error('Erreur lors du login:', error);
          return of(null);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem(this.STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Erreur lors de la lecture du localStorage:', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}