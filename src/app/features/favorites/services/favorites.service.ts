import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FavoriteOffer } from "../models/favorites.model";
import { Observable } from "rxjs";

@Injectable({ providedIn:'root' })
export class FavoritesService {

  private http = inject(HttpClient);
  private API = "http://localhost:3000/favoritesOffers";

  getFavorites(userId:number):Observable<FavoriteOffer[]>{
    return this.http.get<FavoriteOffer[]>(`${this.API}?userId=${userId}`);
  }

  addFavorite(fav:FavoriteOffer){
    return this.http.post<FavoriteOffer>(this.API,fav);
  }

  removeFavorite(id:number){
    return this.http.delete(`${this.API}/${id}`);
  }
}
