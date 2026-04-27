import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  article: any;

  constructor(private articleService: ArticleService, private authSservice: AuthService, private router: Router) {}

  async ngOnInit() {
    console.log('Dashboard loaded');

    try {
      const article = await this.articleService.getTodayArticle();

      console.log('TODAY ARTICLE:', article);

      this.article = article;
    } catch (err) {
      console.error('Error loading article:', err);
    }
  }

  async logout() {
    await this.authSservice.signOut();
    this.router.navigate(['/']);
  }
}
