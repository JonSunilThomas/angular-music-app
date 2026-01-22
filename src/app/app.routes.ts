import { Routes } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list';
import { PlaylistManagerComponent } from './components/playlist-manager/playlist-manager';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail';
import { FavoritesComponent } from './components/favorites/favorites'; // Import the new page

export const routes: Routes = [
  // Default Home Page
  { path: '', component: SongListComponent },
  
  // Playlist Management
  { path: 'playlists', component: PlaylistManagerComponent },
  
  // Playlist Detail (e.g., /playlists/1)
  { path: 'playlists/:id', component: PlaylistDetailComponent },

  // Favorites Page
  { path: 'favorites', component: FavoritesComponent },
  
  // Redirect unknown URLs to Home
  { path: '**', redirectTo: '' }
];