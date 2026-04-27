import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async signup() {
    this.error = '';

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const { data, error } = await this.supabase.supabase.auth.signUp({
      email: this.email,
      password: this.password,
      options: {
        data: {
          name: this.name
        }
      }
    });

    if (error) {
      this.error = error.message;
      return;
    }

    // Create profile row (important)
    if (data.user) {
      await this.supabase.supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name: this.name,
        topics: []
      });
    }

    // ALWAYS navigate (important fix)
    this.router.navigate(['/dashboard']);
  }
}
