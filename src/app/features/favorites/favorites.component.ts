import { Component, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as FavSelectors from "./store/favorites.selectors";
import * as FavActions from "./store/favorites.actions";
import { AsyncPipe, NgFor } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";

@Component({
  standalone:true,
  imports:[NgFor,AsyncPipe],
  templateUrl:"./favorites.component.html"
})
export class FavoritesComponent implements OnInit{

  store = inject(Store);
  auth = inject(AuthService);

  favorites$ = this.store.select(FavSelectors.selectAllFavorites);

  ngOnInit(){
  const user = this.auth.getCurrentUser();

  if (!user || user.id === undefined) {
    console.warn('Utilisateur non connecté ou id manquant');
    return;
  }

  this.store.dispatch(FavActions.loadFavorites({ userId: user.id }));
}


  remove(id:number){
    this.store.dispatch(FavActions.removeFavorite({id}));
  }
}
