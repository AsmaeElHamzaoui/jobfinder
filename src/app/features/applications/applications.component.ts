// src/app/features/applications/applications.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationsService } from './services/applications.service';
import { Application } from './models/application.model';
import { HeaderComponent } from '../../shared/components/header';
import { FooterComponent } from '../../shared/components/footer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  private applicationsService = inject(ApplicationsService);
  private authService = inject(AuthService);

  applications: Application[] = [];
  filteredApplications: Application[] = [];
  loading = false;
  
  // Filtres
  selectedStatus: string = 'all';
  searchTerm: string = '';

  // Édition de notes
  editingNotes: Record<string, boolean> = {}; // ← Changé ici
  tempNotes: Record<string, string> = {}; // ← Changé ici

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    console.log('🔵 ApplicationsComponent - Initialisation');
    this.loadApplications();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private getUserId(): string | null {
    const user = this.authService.getCurrentUser();
    return user?.id ? String(user.id) : null;
  }

  loadApplications(): void {
    const userId = this.getUserId();
    if (!userId) {
      console.warn('⚠️ Utilisateur non connecté');
      return;
    }

    this.loading = true;
    this.subscription = this.applicationsService.getUserApplications(userId)
      .subscribe({
        next: (apps) => {
          this.applications = apps.sort((a, b) => 
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
          this.applyFilters();
          this.loading = false;
          console.log('✅ Candidatures chargées:', this.applications.length);
        },
        error: (err) => {
          console.error('❌ Erreur chargement candidatures:', err);
          this.applications = [];
          this.filteredApplications = [];
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.applications];

    // Filtre par statut
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === this.selectedStatus);
    }

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.title.toLowerCase().includes(term) ||
        app.company.toLowerCase().includes(term) ||
        app.location.toLowerCase().includes(term)
      );
    }

    this.filteredApplications = filtered;
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  updateStatus(app: Application, newStatus: 'en_attente' | 'accepte' | 'refuse'): void {
    if (!app.id) return;

    this.applicationsService.updateApplication(app.id, { status: newStatus })
      .subscribe({
        next: () => {
          app.status = newStatus;
          console.log(`✅ Statut mis à jour: ${newStatus}`);
        },
        error: (err) => {
          console.error('❌ Erreur mise à jour statut:', err);
        }
      });
  }

  startEditingNotes(app: Application): void {
    if (!app.id) return;
    const id = app.id; // ← Extraction dans une constante
    this.editingNotes[id] = true;
    this.tempNotes[id] = app.notes || '';
  }

  saveNotes(app: Application): void {
    if (!app.id) return;

    const id = app.id; // ← Extraction dans une constante
    const newNotes = this.tempNotes[id] || '';
    
    this.applicationsService.updateApplication(id, { notes: newNotes })
      .subscribe({
        next: () => {
          app.notes = newNotes;
          this.editingNotes[id] = false;
          console.log('✅ Notes sauvegardées');
        },
        error: (err) => {
          console.error('❌ Erreur sauvegarde notes:', err);
        }
      });
  }

  cancelEditingNotes(app: Application): void {
    if (!app.id) return;
    const id = app.id; // ← Extraction dans une constante
    this.editingNotes[id] = false;
    this.tempNotes[id] = '';
  }

  deleteApplication(app: Application): void {
    if (!app.id) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la candidature "${app.title}" ?`)) {
      return;
    }

    this.applicationsService.deleteApplication(app.id)
      .subscribe({
        next: () => {
          this.applications = this.applications.filter(a => a.id !== app.id);
          this.applyFilters();
          console.log('✅ Candidature supprimée');
        },
        error: (err) => {
          console.error('❌ Erreur suppression:', err);
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'en_attente': return 'bg-warning text-dark';
      case 'accepte': return 'bg-success';
      case 'refuse': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'en_attente': return '⏳ En attente';
      case 'accepte': return '✅ Accepté';
      case 'refuse': return '❌ Refusé';
      default: return status;
    }
  }

  getCountByStatus(status: string): number {
    if (status === 'all') return this.applications.length;
    return this.applications.filter(app => app.status === status).length;
  }
}