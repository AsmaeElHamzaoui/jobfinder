// src/app/features/jobs/jobs.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from './services/jobs.service';
import { Job } from './models/job.model';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  private jobsService = inject(JobsService);
  private authService = inject(AuthService);

  // État de l'interface
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = false;
  
  // Paramètres de recherche
  keyword = '';
  location = '';
  
  // Pagination
  page = 1;
  totalPages = 1;

  ngOnInit(): void {
    console.log(' JobsComponent - Initialisation');
    console.log(' Utilisateur connecté:', this.isLogged());
    this.loadJobs();
  }

  /**
   * Charge les offres d'emploi
   */
  loadJobs(): void {
    console.log(' Chargement des jobs - Page:', this.page);
    this.loading = true;

    this.jobsService.getJobs({
      page: this.page,
      keyword: this.keyword,
      location: this.location
    }).subscribe({
      next: (response) => {
        this.jobs = response.results;
        this.totalPages = response.page_count;

        // Appliquer les filtres et le tri
        this.filteredJobs = this.jobsService.filterJobsByKeyword(
          this.jobs, 
          this.keyword
        );
        
        this.filteredJobs = this.jobsService.sortJobsByDate(
          this.filteredJobs
        );

        console.log(' Jobs chargés:', this.filteredJobs.length);
        this.loading = false;
      },
      error: () => {
        this.jobs = [];
        this.filteredJobs = [];
        this.totalPages = 1;
        this.loading = false;
      }
    });
  }

  /**
   * Recherche avec les nouveaux critères
   */
  search(): void {
    console.log(' Recherche lancée');
    this.page = 1;
    this.loadJobs();
  }

  /**
   * Page suivante
   */
  nextPage(): void {
    if (this.page < this.totalPages) {
      console.log(' Page suivante');
      this.page++;
      this.loadJobs();
    }
  }

  /**
   * Page précédente
   */
  prevPage(): void {
    if (this.page > 1) {
      console.log(' Page précédente');
      this.page--;
      this.loadJobs();
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLogged(): boolean {
    return this.authService.isAuthenticated();
  }
}