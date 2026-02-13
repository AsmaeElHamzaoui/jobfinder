import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as FavActions from "./favorites.actions";
import { FavoritesService } from "../services/favorites.service";
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class FavoritesEffects{

  actions$ = inject(Actions);
  service = inject(FavoritesService);


  load$ = createEffect(()=> this.actions$.pipe(
    ofType(FavActions.loadFavorites),
    mergeMap(a => this.service.getFavorites(a.userId).pipe(
      map(res=>FavActions.loadFavoritesSuccess({favorites:res})),
      catchError(err=>of(FavActions.loadFavoritesFailure({error:err.message})))
    ))
  ));


  add$ = createEffect(()=> this.actions$.pipe(
    ofType(FavActions.addFavorite),
    mergeMap(a=> this.service.addFavorite(a.favorite).pipe(
      map(res=>FavActions.addFavoriteSuccess({favorite:res})),
      catchError(err=>of(FavActions.addFavoriteFailure({error:err.message})))
    ))
  ));


  remove$ = createEffect(()=> this.actions$.pipe(
    ofType(FavActions.removeFavorite),
    mergeMap(a=> this.service.removeFavorite(a.id).pipe(
      map(()=>FavActions.removeFavoriteSuccess({id:a.id})),
      catchError(err=>of(FavActions.removeFavoriteFailure({error:err.message})))
    ))
  ));

}
