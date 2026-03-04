import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SongPlayerComponent } from './components/song-player/song-player';
import { NavbarComponent } from './components/navbar/navbar';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner.component';
import { ThemeService } from './services/theme.service';
import { routeTransition } from './shared/animations/route-transition';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SongPlayerComponent, NavbarComponent, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [routeTransition]
})
export class AppComponent {
  title = 'music-app';
  themeService = inject(ThemeService);
}