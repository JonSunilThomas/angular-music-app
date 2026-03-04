import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';
import { fadeIn } from '../../shared/animations/route-transition';

@Component({
  selector: 'app-feedback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    AutoFocusDirective
  ],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css'],
  animations: [fadeIn]
})
export class FeedbackComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  feedbackForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    category: ['general', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'other', label: 'Other' }
  ];

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.snackBar.open('Thank you for your feedback!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.feedbackForm.reset();
    }
  }

  get charCount(): number {
    return this.feedbackForm.get('message')?.value?.length || 0;
  }
}
