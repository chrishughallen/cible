import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  article: any;
  loading = true;
  noTopics = false
  profile: any = null;

  constructor(private articleService: ArticleService, private authService: AuthService) {}

  async ngOnInit() {
    this.loading = true;

    try {
      this.profile = await this.authService.getUserProfile();

      const topics = this.profile?.topics || [];

      if (topics.length === 0) {
        this.noTopics = true;
        return;
      }

      this.article = await this.articleService.getTodayArticle();

    } catch (err) {
      console.error('❌ Dashboard error:', err);

    } finally {
      this.loading = false;
    }
  }
}
