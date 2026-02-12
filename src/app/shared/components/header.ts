import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top px-3">

  <a class="navbar-brand fw-bold logo" routerLink="/">
    JobFinder
  </a>

  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="nav">

    <ul class="navbar-nav ms-auto align-items-lg-center">

      <li class="nav-item">
        <a routerLink="/" class="nav-link">Accueil</a>
      </li>

      <li class="nav-item">
        <a routerLink="/jobs" class="nav-link">Postes</a>
      </li>

      <ng-container *ngIf="auth.isAuthenticated(); else guest">

        <li class="nav-item">
          <a routerLink="/favorites" class="nav-link">Favoris</a>
        </li>

        <li class="nav-item">
          <a routerLink="/profile" class="nav-link">Profil</a>
        </li>

        <li class="nav-item ms-lg-2">
          <button class="btn btn-logout" (click)="logout()">Déconnexion</button>
        </li>

      </ng-container>

      <ng-template #guest>
        <li class="nav-item ms-lg-2">
          <a routerLink="/login" class="btn btn-login">Connexion</a>
        </li>
      </ng-template>

    </ul>

  </div>
</nav>
  `,
  styles:[`
.navbar{height:70px}
.logo{color:#2d1e17;font-size:1.4rem}
.nav-link{font-weight:500;color:#2d1e17}
.nav-link:hover{color:#ff8c42}
.btn-login{
  background:#ff8c42;
  color:white;
  border-radius:30px;
  padding:6px 18px;
  font-weight:600;
}
.btn-login:hover{background:#e6762f}
.btn-logout{
  border-radius:30px;
  border:1px solid #ff8c42;
  color:#ff8c42;
  font-weight:600;
}
.btn-logout:hover{
  background:#ff8c42;
  color:white;
}
  `]
})
export class HeaderComponent{
  auth = inject(AuthService);

  logout(){
    this.auth.logout();
    location.href="/";
  }
}
