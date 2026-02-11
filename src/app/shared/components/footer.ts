import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector:'app-footer',
  standalone:true,
  imports:[CommonModule,RouterModule],
  template:`
<footer class="footer mt-5">

  <div class="container py-5">

    <div class="row gy-4">

      <div class="col-lg-4">
        <h4 class="brand">JobFinder</h4>
        <p class="text-muted">
          Plateforme intelligente de recherche d'emploi connectant talents et entreprises.
        </p>
      </div>

      <div class="col-lg-4">
        <h6 class="fw-bold mb-3">Navigation</h6>
        <ul class="list-unstyled">
          <li><a routerLink="/">Accueil</a></li>
          <li><a routerLink="/jobs">Postes</a></li>
          <li><a routerLink="/favorites">Favoris</a></li>
        </ul>
      </div>

      <div class="col-lg-4">
        <h6 class="fw-bold mb-3">Réseaux</h6>
        <div class="socials">
          <i class="bi bi-linkedin"></i>
          <i class="bi bi-twitter"></i>
          <i class="bi bi-github"></i>
        </div>
      </div>

    </div>

  </div>

  <div class="copyright text-center py-3">
    © 2026 JobFinder — Tous droits réservés
  </div>

</footer>
  `,
  styles:[`
.footer{
  background:#2d1e17;
  color:white;
}
.brand{color:#ff8c42}
.footer a{
  color:#f4e1d2;
  text-decoration:none;
  display:block;
  margin-bottom:8px;
}
.footer a:hover{color:#ff8c42}
.socials i{
  font-size:1.4rem;
  margin-right:15px;
  cursor:pointer;
  transition:.3s;
}
.socials i:hover{
  color:#ff8c42;
  transform:translateY(-3px);
}
.copyright{
  background:#1b120d;
  font-size:.9rem;
}
  `]
})
export class FooterComponent{}
