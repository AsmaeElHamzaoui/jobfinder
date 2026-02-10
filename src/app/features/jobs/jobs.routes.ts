// src/app/features/jobs/jobs.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const jobsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./jobs-list/jobs-list.component').then(m => m.JobsListComponent),
    canActivate: [AuthGuard] // Protection de la route
  }
];