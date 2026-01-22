// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. IMPORT THE COMPONENTS
// Check your file structure. If your player file is named 'song-player.ts',
// ensure the path ends in just './components/song-player/song-player'
import { SongListComponent } from './components/song-list/song-list';
import { SongPlayerComponent } from './components/song-player/song-player';
import { NavbarComponent } from './components/navbar/navbar'; // (or just navbar/navbar)

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. ADD THEM TO THIS ARRAY
  imports: [RouterOutlet, SongListComponent, SongPlayerComponent, NavbarComponent], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent { // It's okay if this class is named AppComponent
  title = 'music-app';
}