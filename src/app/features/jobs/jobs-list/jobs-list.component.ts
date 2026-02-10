// src/app/features/jobs/jobs-list/jobs-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="jobs-container">
      <header class="jobs-header">
        <h1>🎯 Recherche d'emplois</h1>
        
        <div class="user-info" *ngIf="currentUser">
          <p>Bienvenue, <strong>{{ currentUser.firstName }} {{ currentUser.lastName }}</strong></p>
          <p class="email">{{ currentUser.email }}</p>
          <button (click)="logout()" class="btn-logout">Se déconnecter</button>
        </div>
      </header>

      <div class="success-message">
        <h2>✅ Authentification réussie !</h2>
        <p>Vous êtes maintenant connecté et redirigé vers la page des emplois.</p>
      </div>

      <div class="jobs-placeholder">
        <h3>📋 Liste des emplois (à venir)</h3>
        <p>Cette section affichera prochainement les offres d'emploi disponibles.</p>
        
        <div class="demo-cards">
          <div class="job-card">
            <h4>Développeur Frontend Angular</h4>
            <p>📍 Paris • 💰 45-55k€ • ⏰ CDI</p>
          </div>
          <div class="job-card">
            <h4>Développeur Full Stack</h4>
            <p>📍 Lyon • 💰 40-50k€ • ⏰ CDI</p>
          </div>
          <div class="job-card">
            <h4>DevOps Engineer</h4>
            <p>📍 Remote • 💰 50-60k€ • ⏰ CDI</p>
          </div>
        </div>
      </div>

      <div class="debug-info">
        <h4>🔍 Informations de débogage</h4>
        <pre>{{ currentUser | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .jobs-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .jobs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .jobs-header h1 {
      margin: 0;
      color: #333;
    }

    .user-info {
      text-align: right;
    }

    .user-info p {
      margin: 0.25rem 0;
    }

    .user-info .email {
      color: #666;
      font-size: 0.9rem;
    }

    .btn-logout {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn-logout:hover {
      background-color: #c82333;
    }

    .success-message {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .success-message h2 {
      color: #155724;
      margin: 0 0 0.5rem 0;
    }

    .success-message p {
      color: #155724;
      margin: 0;
    }

    .jobs-placeholder {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .jobs-placeholder h3 {
      color: #333;
      margin-top: 0;
    }

    .demo-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .job-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .job-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .job-card h4 {
      margin: 0 0 0.5rem 0;
      color: #007bff;
    }

    .job-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .debug-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
    }

    .debug-info h4 {
      margin-top: 0;
      color: #666;
    }

    .debug-info pre {
      background-color: #fff;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.85rem;
    }
  `]
})
export class JobsListComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté
    this.currentUser = this.authService.getCurrentUser();
    
    console.log('🎯 JobsListComponent - User:', this.currentUser);
    
    // Si pas d'utilisateur, rediriger vers login
    if (!this.currentUser) {
      console.warn('⚠️ Pas d\'utilisateur connecté, redirection vers login');
      this.router.navigate(['/auth/login']);
    }
  }

  logout(): void {
    console.log('👋 Déconnexion...');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}