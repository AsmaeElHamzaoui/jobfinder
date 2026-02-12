// src/app/features/jobs/jobs.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { JobsComponent } from './jobs.component';
export const jobsRoutes: Routes = [

    { path: '', component: JobsComponent }
];