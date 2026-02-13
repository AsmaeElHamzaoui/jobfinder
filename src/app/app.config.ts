import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/http-error.interceptor';


// NgRx Favorites
import { favoritesReducer } from './features/favorites/store/favorites.reducer';
import { FavoritesEffects } from './features/favorites/store/favorites.effects';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    ),
      // STORE GLOBAL
    provideStore({
      favorites: favoritesReducer
    }),

    // EFFECTS
    provideEffects([
      FavoritesEffects
    ])
  ]
};
