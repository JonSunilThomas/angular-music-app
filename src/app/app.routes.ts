import { Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  // Songs (detail pages at /songs/:id)
  {
    path: 'songs',
    loadChildren: () => import('./features/songs/songs.routes').then(m => m.songsRoutes)
  },

  // Playlists
  {
    path: 'playlists',
    loadChildren: () => import('./features/playlists/playlists.routes').then(m => m.playlistsRoutes)
  },

  // Artists
  {
    path: 'artists',
    loadChildren: () => import('./features/artists/artists.routes').then(m => m.artistsRoutes)
  },

  // Favorites
  {
    path: 'favorites',
    loadChildren: () => import('./features/favorites/favorites.routes').then(m => m.favoritesRoutes)
  },

  // Recently Played & Stats
  {
    path: 'stats',
    loadChildren: () => import('./features/recently-played/recently-played.routes').then(m => m.recentlyPlayedRoutes)
  },

  // Auth
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Feedback
  {
    path: 'feedback',
    loadChildren: () => import('./features/feedback/feedback.routes').then(m => m.feedbackRoutes)
  },

  // Redirect unknown paths
  { path: '', redirectTo: 'songs', pathMatch: 'full' },
  { path: '**', redirectTo: 'songs' }
];