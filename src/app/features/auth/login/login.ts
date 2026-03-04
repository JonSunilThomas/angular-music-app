import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutoFocusDirective } from '../../../directives/auto-focus.directive';
import { fadeIn } from '../../../shared/animations/route-transition';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    AutoFocusDirective
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  animations: [fadeIn]
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  hidePassword = true;

  onSubmit(): void {
    if (this.email && this.password) {
      console.log('Login:', { email: this.email, rememberMe: this.rememberMe });
    }
  }
}
