import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // 🔹 Redirection par défaut
//  {
//     path: '',
//     component: HomeComponent,
//     pathMatch: 'full'
//   },

  // 🔹 Authentification (lazy loading)
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  // 🔹 Recherche d'emplois (public)
  {
    path: 'jobs',
    loadChildren: () =>
      import('./features/jobs/jobs.routes')
        .then(m => m.jobsRoutes)
  },

  // 🔹 Favoris (protégé + lazy loading)
//   {
//     path: 'favorites',
//     canActivate: [AuthGuard],
//     loadChildren: () =>
//       import('./features/favorites/favorites.routes')
//         .then(m => m.favoritesRoutes)
//   },

  // 🔹 Candidatures (protégé + lazy loading)
//   {
//     path: 'applications',
//     canActivate: [AuthGuard],
//     loadChildren: () =>
//       import('./features/applications/applications.routes')
//         .then(m => m.applicationsRoutes)
//   },

  // 🔹 Profil utilisateur (protégé)
//   {
//     path: 'profile',
//     canActivate: [AuthGuard],
//     loadChildren: () =>
//       import('./features/profile/profile.routes')
//         .then(m => m.profileRoutes)
//   },

  // 🔹 Page 404
  {
    path: '**',
    redirectTo: 'jobs'
  }
];
