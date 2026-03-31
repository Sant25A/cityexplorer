import { Routes } from '@angular/router';

import { Home } from './features/places/pages/home/home';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { PlacesList } from './features/places/pages/places-list/places-list';
import { FavoritesPage } from './features/favorites/pages/favorites-page/favorites-page';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'places', component: PlacesList },
  { path: 'favorites', component: FavoritesPage },

  { path: '**', redirectTo: '' }
];