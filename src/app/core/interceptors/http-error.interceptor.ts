import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError(error => {

      let errorMessage = 'Une erreur est survenue';

      if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur';
      } else if (error.status === 400) {
        errorMessage = 'Requête invalide';
      } else if (error.status === 401) {
        errorMessage = 'Accès non autorisé';
      } else if (error.status === 403) {
        errorMessage = 'Accès interdit';
      } else if (error.status === 404) {
        errorMessage = 'Ressource introuvable';
      } else if (error.status >= 500) {
        errorMessage = 'Erreur serveur interne';
      }

      console.error('HTTP Error:', error);

      /**
       * On renvoie une erreur enrichie
       * pour pouvoir afficher un message clair
       * côté composant
       */
      return throwError(() => ({
        ...error,
        message: errorMessage
      }));
    })
  );
};
