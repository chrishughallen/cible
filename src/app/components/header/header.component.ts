import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: any = null;
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}


  async ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }
}
