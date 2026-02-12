// src/app/features/jobs/jobs.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from './services/jobs.service';
import { Job } from './models/job.model';
import { HeaderComponent } from '../../shared/components/header';
import { FooterComponent } from '../../shared/components/footer';
import { Store } from '@ngrx/store';
import * as FavSelectors from '../favorites/store/favorites.selectors';
import * as FavActions from '../favorites/store/favorites.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit, OnDestroy {
  private jobsService = inject(JobsService);
  private authService = inject(AuthService);
  private store = inject(Store);

  // État de l'interface
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  displayedJobs: Job[] = [];
  loading = false;

  // Paramètres de recherche
  keyword = '';
  location = '';

  // Pagination
  page = 1;
  pageSize = 10;
  totalPages = 1;
  totalResults = 0;

  // Favoris de l'utilisateur
  favoritedOfferIds: string[] = [];
  private favSubscription: Subscription | null = null;

  ngOnInit(): void {
    console.log('🔵 JobsComponent - Initialisation');

    const userId = this.getUserId();
    if (userId) {
      // Charger les favoris depuis le store (ou backend)
      this.store.dispatch(FavActions.loadFavorites({ userId }));

      this.favSubscription = this.store.select(FavSelectors.selectAllFavorites)
        .subscribe(favs => {
          this.favoritedOfferIds = favs
            .filter(f => f.userId === userId)
            .map(f => f.offerId);

          // Si pas de backend, charger depuis localStorage
          if (this.favoritedOfferIds.length === 0) {
            const savedFavs = localStorage.getItem('favoritedOfferIds');
            this.favoritedOfferIds = savedFavs ? JSON.parse(savedFavs) : [];
          }
        });
    } else {
      // Pas connecté → charger localStorage si nécessaire
      const savedFavs = localStorage.getItem('favoritedOfferIds');
      this.favoritedOfferIds = savedFavs ? JSON.parse(savedFavs) : [];
    }

    this.loadJobs();
  }

  ngOnDestroy(): void {
    this.favSubscription?.unsubscribe();
  }

  isLogged(): boolean {
    return this.authService.isAuthenticated();
  }

  private getUserId(): number | null {
    const user = this.authService.getCurrentUser();
    return user?.id ?? null;
  }

  // Vérifie si l'offre est déjà en favoris
  isFavorited(job: Job): boolean {
    return this.favoritedOfferIds.includes(String(job.id));
  }

  // Ajouter aux favoris
  addToFavorites(job: Job): void {
    const userId = this.getUserId();
    if (!userId) {
      console.warn('Utilisateur non connecté !');
      return;
    }

    if (this.isFavorited(job)) {
      console.log(`L'offre "${job.name}" est déjà dans vos favoris.`);
      return;
    }

    // Ajout immédiat à la liste locale pour mise à jour UI
    this.favoritedOfferIds.push(String(job.id));

    // Persister dans localStorage (optionnel si pas de backend)
    localStorage.setItem('favoritedOfferIds', JSON.stringify(this.favoritedOfferIds));

    // Dispatcher l'action NGRX pour le store / backend
    this.store.dispatch(FavActions.addFavorite({
      favorite: {
        userId,
        offerId: String(job.id),
        title: job.name,
        company: job.company?.name ?? '',
        location: job.locations?.[0]?.name ?? ''
      }
    }));

    console.log(`⭐ Offre "${job.name}" ajoutée aux favoris`);
  }

  trackApplication(job: Job): void {
    console.log('📋 Suivre la candidature:', job.name);
    // TODO: Implémenter le suivi
  }

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
        this.jobs = response.results || [];
        this.totalPages = response.page_count || 1;
        this.totalResults = response.total || this.jobs.length;

        this.filteredJobs = this.jobsService.filterJobsByKeyword(this.jobs, this.keyword);
        this.filteredJobs = this.jobsService.sortJobsByDate(this.filteredJobs);

        this.displayedJobs = this.filteredJobs.slice(0, this.pageSize);
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

  search(): void {
    this.page = 1;
    this.loadJobs();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadJobs();
      this.scrollToTop();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadJobs();
      this.scrollToTop();
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.page) {
      this.page = pageNumber;
      this.loadJobs();
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.page - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }
}
