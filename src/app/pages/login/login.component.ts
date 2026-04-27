import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    const { data, error } = await this.auth.signIn(
      this.email,
      this.password
    );

    if (data?.user) {
      this.router.navigate(['/dashboard']);
    }

    console.log(data, error);
  }
}
