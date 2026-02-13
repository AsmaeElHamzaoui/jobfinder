import { createReducer, on } from "@ngrx/store";
import * as FavActions from "./favorites.actions";
import { initialState } from "./favorites.state";

export const favoritesReducer = createReducer(

  initialState,

  on(FavActions.loadFavorites, state => ({
    ...state,
    loading:true
  })),

  on(FavActions.loadFavoritesSuccess,(state,{favorites})=>({
    ...state,
    favorites,
    loading:false
  })),

  on(FavActions.addFavoriteSuccess,(state,{favorite})=>({
    ...state,
    favorites:[...state.favorites,favorite]
  })),

  on(FavActions.removeFavoriteSuccess,(state,{id})=>({
    ...state,
    favorites: state.favorites.filter(f=>f.id!==id)
  })),

  on(
    FavActions.loadFavoritesFailure,
    FavActions.addFavoriteFailure,
    FavActions.removeFavoriteFailure,
    (state,{error})=>({
      ...state,
      error,
      loading:false
    })
  )
);
