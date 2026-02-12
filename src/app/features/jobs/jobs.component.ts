// src/app/features/jobs/jobs.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from './services/jobs.service';
import { Job } from './models/job.model';
import { HeaderComponent } from '../../shared/components/header';
import { FooterComponent } from '../../shared/components/footer';
@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule,HeaderComponent,FooterComponent, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  private jobsService = inject(JobsService);
  private authService = inject(AuthService);

  // État de l'interface
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  displayedJobs: Job[] = []; // 10 jobs max affichés
  loading = false;
  
  // Paramètres de recherche
  keyword = '';
  location = '';
  
  // Pagination (10 résultats par page)
  page = 1;
  pageSize = 10;
  totalPages = 1;
  totalResults = 0;

  ngOnInit(): void {
    console.log('🔵 JobsComponent - Initialisation');
    console.log('🔵 Utilisateur connecté:', this.isLogged());
    this.loadJobs();
  }

  /**
   * Charge les offres d'emploi (max 10 par page)
   */
  loadJobs(): void {
    console.log('🔍 Chargement des jobs - Page:', this.page);
    this.loading = true;

    this.jobsService.getJobs({
      page: this.page,
      pageSize: this.pageSize,
      keyword: this.keyword,
      location: this.location
    }).subscribe({
      next: (response) => {
        console.log('📦 Réponse reçue:', response);
        
        this.jobs = response.results || [];
        this.totalPages = response.page_count || 1;
        this.totalResults = response.total || this.jobs.length;

        // EXIGENCE 1: Filtrer par mot-clé UNIQUEMENT dans le titre
        this.filteredJobs = this.jobsService.filterJobsByKeyword(
          this.jobs, 
          this.keyword
        );
        
        // EXIGENCE 2: Trier par date (plus récent → plus ancien)
        this.filteredJobs = this.jobsService.sortJobsByDate(
          this.filteredJobs
        );

        // EXIGENCE 3: Limiter à 10 résultats par page
        this.displayedJobs = this.filteredJobs.slice(0, this.pageSize);

        console.log('✅ Jobs affichés:', this.displayedJobs.length);
        console.log('✅ Total pages:', this.totalPages);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement:', err);
        this.jobs = [];
        this.filteredJobs = [];
        this.displayedJobs = [];
        this.totalPages = 1;
        this.totalResults = 0;
        this.loading = false;
      }
    });
  }

  /**
   * Recherche avec les nouveaux critères
   */
  search(): void {
    console.log('🔍 Recherche lancée');
    console.log('📝 Keyword:', this.keyword);
    console.log('📍 Location:', this.location);
    
    this.page = 1; // Reset à la page 1
    this.loadJobs();
  }

  /**
   * Page suivante
   */
  nextPage(): void {
    if (this.page < this.totalPages) {
      console.log('➡️ Page suivante:', this.page + 1);
      this.page++;
      this.loadJobs();
      this.scrollToTop();
    }
  }

  /**
   * Page précédente
   */
  prevPage(): void {
    if (this.page > 1) {
      console.log('⬅️ Page précédente:', this.page - 1);
      this.page--;
      this.loadJobs();
      this.scrollToTop();
    }
  }

  /**
   * Aller à une page spécifique
   */
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.page) {
      console.log('📄 Navigation vers page:', pageNumber);
      this.page = pageNumber;
      this.loadJobs();
      this.scrollToTop();
    }
  }

  /**
   * Scroll vers le haut après changement de page
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLogged(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Ajouter aux favoris (à implémenter)
   */
  addToFavorites(job: Job): void {
    console.log('⭐ Ajout aux favoris:', job.name);
    // TODO: Implémenter la logique d'ajout aux favoris
  }

  /**
   * Suivre cette candidature (à implémenter)
   */
  trackApplication(job: Job): void {
    console.log('📋 Suivre la candidature:', job.name);
    // TODO: Implémenter la logique de suivi de candidature
  }

  /**
   * Générer les numéros de page pour la pagination
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.page - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}