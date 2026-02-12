import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FavoritesState } from "./favorites.state";

export const selectFavoritesState =
  createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  state => state.favorites
);

export const selectIsFavorite = (offerId:string) =>
  createSelector(
    selectFavoritesState,
    state => state.favorites.some(f => f.offerId === offerId)
  );

export const selectLoading = createSelector(
  selectFavoritesState,
  s => s.loading
);
